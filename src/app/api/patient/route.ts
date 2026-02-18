import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, age, gender, bloodGroup, city } = body;

        if (!id) {
            return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
        }

        const data: any = {};
        if (name) data.name = name;
        if (age) data.age = String(age);
        if (gender) data.gender = gender;
        if (bloodGroup) data.bloodGroup = bloodGroup;
        if (city) data.city = city;

        const updatedPatient = await prisma.patient.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedPatient, { status: 200 });
    } catch (error: any) {
        console.error("Error updating patient:", error);
        return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, age, gender, bloodGroup } = body;

        const patient = await prisma.patient.create({
            data: {
                username: `user_${Date.now()}`, // Fallback for old flow
                password: "placeholder_pwd",    // Fallback
                name,
                age: String(age),
                gender,
                bloodGroup,
            },
        });

        return NextResponse.json(patient, { status: 201 });
    } catch (error: any) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
}
