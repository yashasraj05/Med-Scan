"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Droplet, UserCircle, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [patientId, setPatientId] = useState("");

    // Auth Check
    useEffect(() => {
        const details = localStorage.getItem("patientDetails");
        if (!details) {
            router.push("/signup");
        } else {
            const parsed = JSON.parse(details);
            setPatientId(parsed.id);
        }
    }, [router]);

    const [formData, setFormData] = useState({
        name: "",
        city: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // We use 'PUT' to update the existing user created during signup
            const response = await fetch("/api/patient", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: patientId }),
            });

            if (response.ok) {
                const updatedPatient = await response.json();
                localStorage.setItem("patientDetails", JSON.stringify(updatedPatient));
                router.push("/");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to update profile");
                setLoading(false);
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            setError("Update failed");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10 space-y-4">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Complete Your Profile</h1>
                    <p className="text-zinc-500">Tell us a bit more about yourself so we can personalize your experience.</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-zinc-900 placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        {/* City Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">City</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    placeholder="e.g. New York"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-zinc-900 placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !patientId}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <span>Saving...</span>
                            ) : (
                                <>
                                    <span>Complete Profile</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
