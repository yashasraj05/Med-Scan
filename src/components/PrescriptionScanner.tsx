"use client";

import { useState } from "react";
import { Upload, Camera, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Medicine } from "./MedicineDetails";

interface PrescriptionScannerProps {
    onDataExtracted: (data: { medicines: Medicine[] }) => void;
    patientId?: string;
}

export default function PrescriptionScanner({ onDataExtracted, patientId }: PrescriptionScannerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append("image", file);
        if (patientId) {
            formData.append("patientId", patientId);
        }

        try {
            const response = await fetch("/api/process-prescription", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errData = (await response.json()) as { details?: string };
                throw new Error(errData.details || "Failed to process prescription");
            }

            const data = (await response.json()) as { medicines: Medicine[] };
            if (data) {
                onDataExtracted(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "We couldn't read the prescription properly. Please try a clearer photo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Prescription Digitalizer
                </h2>
                <p className="text-zinc-500 text-lg">
                    Upload your handwritten prescription to get a digital schedule and clear explanations.
                </p>
            </div>

            <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={loading}
                />

                <div className={`
          relative border-3 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 overflow-hidden
          ${loading
                        ? 'bg-zinc-900 border-zinc-700 shadow-2xl shadow-indigo-500/20'
                        : 'bg-white/50 backdrop-blur-sm border-indigo-200/60 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 hover:bg-white/80'
                    }
          ${error ? 'border-red-300 bg-red-50/50' : ''}
          flex flex-col items-center justify-center text-center space-y-8 group-hover:scale-[1.005]
        `}>
                    {/* Scanning Beam Animation - Only visible when loading */}
                    {loading && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-0 animate-scan z-20 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    )}

                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20"
                        >
                            <img src={preview} alt="Prescription preview" className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-40 blur-sm scale-105' : ''}`} />

                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-30">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse rounded-full" />
                                        <div className="relative p-4 bg-zinc-900/50 rounded-2xl border border-white/10 backdrop-blur-md">
                                            <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent animate-pulse">
                                        Analyzing Prescription
                                    </h3>
                                    <p className="text-zinc-400 font-medium text-sm mt-2">Identifying medications & dosages...</p>
                                </div>
                            )}

                            {/* Success Overlay - Optional if you want to show success before redirect */}
                        </motion.div>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="p-8 bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] shadow-xl shadow-indigo-100/50 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white">
                                    <Camera className="w-12 h-12 text-indigo-600 drop-shadow-sm" />
                                </div>
                                {/* Floating Badge */}
                                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg transform rotate-12 scale-0 group-hover:scale-100 transition-transform delay-100">
                                    AI Powered
                                </div>
                            </div>

                            <div className="space-y-3 z-10">
                                <h3 className="text-2xl font-black text-zinc-800 tracking-tight">
                                    Upload Prescription
                                </h3>
                                <p className="text-zinc-500 font-medium max-w-xs mx-auto leading-relaxed">
                                    Drag & drop or <span className="text-indigo-600 underline decoration-2 underline-offset-4 cursor-pointer hover:text-indigo-700">browse</span>
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">JPG</span>
                                <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PNG</span>
                                <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PDF</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
