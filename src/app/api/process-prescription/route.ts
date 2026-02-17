import { NextResponse } from "next/server";
import sharp from "sharp";
import { processWithGemini, extractJSON } from "@/lib/gemini";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File | null;
        const medicineName = formData.get("medicineName") as string | null;
        const patientId = formData.get("patientId") as string | null;

        if (!image && !medicineName) {
            return NextResponse.json({ error: "Provide an image or medicine name" }, { status: 400 });
        }

        let prompt = "";
        if (image) {
            prompt = `
        You are an expert pharmacist and handwriting analyst with 20 years of experience.
        Your task is to accurately digitize this prescription image.
        
        CRITICAL INSTRUCTIONS:
        1. Read every line carefully. If a medicine name is unclear, use your pharmacological knowledge to infer the most likely valid drug name based on context (dosage, frequency).
        2. Identify the dosage (strength) and frequency for each medication.
        3. If multiple medicines are listed, capture ALL of them.
        4. Provide clear, patient-friendly explanations.
        
        For each medicine, return a JSON object with EXACTLY these keys:
        - "name": Official drug/brand name (Capitalized).
        - "dosage": Strength (e.g. "500mg", "10ml"). If not specified, infer from standard strengths or write "As prescribed".
        - "frequency": How often to take (e.g. "Twice daily after meals").
        - "duration": How long to take (e.g. "5 days"). If not specified, write "As directed".
        - "explanation": Simple, 1-sentence explanation of what the drug treats.
        - "purpose": Medical category (e.g. "Antibiotic", "Pain reliever").
        - "sideEffects": 2-3 common side effects.
        - "restrictions": Key warnings (e.g. "Avoid alcohol", "Take with food").
        - "ageDosage": { "Child": "Safe/Consult Dr", "Adult": "Standard", "Senior": "Caution" } (General guidance).
        - "schedule": Array of times ["08:00", "20:00"] based on frequency (e.g. OD=09:00, BD=09:00,21:00, TDS=09:00,14:00,21:00).

        RETURN ONLY RAW JSON. NO MARKDOWN.
        { "medicines": [ ... ] }
      `;
        } else {
            prompt = `
        You are an AI assistant helping a user organize their medication information.
        
        Extract structured information for: "${medicineName}".
        
        Return a JSON object with EXACTLY these keys in a 'medicines' array:
        - "name": "${medicineName}" (Properly capitalized)
        - "dosage": "Standard adult dosage or as prescribed"
        - "frequency": "Common usage frequency (e.g. Daily)"
        - "duration": "As prescribed by doctor"
        - "explanation": Simple explanation of the drug's primary function.
        - "purpose": Medical category/Class.
        - "sideEffects": Common side effects.
        - "restrictions": Important contraindications or warnings.
        - "ageDosage": { "Child": "...", "Adult": "...", "Senior": "..." }
        - "schedule": ["09:00"] (Example time).

        RETURN ONLY RAW JSON. NO MARKDOWN.
        { "medicines": [ ... ] }
      `;
        }

        let imageBase64: string | undefined = undefined;
        if (image) {
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            // Updated image processing: Keep color, higher quality resize, minimal manipulation for VLM
            const processedImageBuffer = await sharp(imageBuffer)
                .rotate() // Auto-rotate based on EXIF
                .resize({ width: 1600, fit: 'inside', withoutEnlargement: true }) // High quality resize
                .toFormat('jpeg', { quality: 85 }) // High quality JPEG
                .toBuffer();

            imageBase64 = processedImageBuffer.toString("base64");
        }

        const response = await processWithGemini(prompt, imageBase64 || undefined);
        const text = response.text();
        const data = extractJSON(text);

        if (patientId) {
            let actualQuery = medicineName || "Prescription Scan";
            if (!medicineName && data.medicines && Array.isArray(data.medicines)) {
                const detectedMeds = data.medicines.map((m: { name: string }) => m.name).join(", ");
                if (detectedMeds) {
                    actualQuery += `: ${detectedMeds}`;
                }
            }

            try {
                await prisma.searchHistory.create({
                    data: {
                        query: actualQuery.substring(0, 500), // Limit length just in case
                        patientId: patientId,
                    },
                });
            } catch (historyError) {
                console.warn("Failed to save search history:", historyError);
                // Non-critical, continue
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error - Process Prescription:", error);
        return NextResponse.json({
            error: "Processing failed",
            details: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
