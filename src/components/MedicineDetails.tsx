import { Pill, AlertCircle, Info, Clock, AlertTriangle, UserRound, BookOpen, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    explanation: string;
    purpose: string;
    sideEffects: string;
    restrictions: string;
    ageDosage: string | Record<string, string>;
    schedule: string[];
}

interface MedicineDetailsProps {
    medicines: Medicine[];
}

export default function MedicineDetails({ medicines }: MedicineDetailsProps) {
    return (
        <div className="grid grid-cols-1 gap-8 p-2">
            {medicines.map((med, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-zinc-200/60 border border-zinc-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                >
                    {/* Decorative Background Icon */}
                    <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none rotate-12">
                        <Pill className="w-64 h-64 text-blue-600" />
                    </div>

                    <div className="space-y-10 relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-zinc-100">
                            <div className="space-y-3 max-w-2xl">
                                <div className="flex flex-wrap items-center gap-4">
                                    <h3 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-none bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">{med.name}</h3>
                                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full border border-green-200/50 shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Verified Safe
                                    </span>
                                </div>
                                <p className="text-lg text-zinc-500 font-medium leading-relaxed">{med.explanation}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 min-w-fit">
                                <div className="px-5 py-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3 shadow-sm hover:bg-blue-50 transition-colors">
                                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-bold text-blue-900">{med.frequency}</span>
                                </div>
                                <div className="px-5 py-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-3 shadow-sm hover:bg-purple-50 transition-colors">
                                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-sm font-bold text-purple-900">{med.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Detailed Purpose */}
                            <div className="bg-blue-50/80 rounded-[2rem] p-8 border border-blue-100 hover:bg-blue-100/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group/item">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover/item:scale-110 transition-transform">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-extrabold text-blue-900 text-lg tracking-tight">Medical Purpose</h4>
                                </div>
                                <p className="text-blue-800 leading-relaxed font-medium">{med.purpose}</p>
                            </div>

                            {/* Side Effects */}
                            <div className="bg-orange-50/80 rounded-[2rem] p-8 border border-orange-100 hover:bg-orange-100/80 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group/item">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30 group-hover/item:scale-110 transition-transform">
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-extrabold text-orange-950 text-lg tracking-tight">Possible Side Effects</h4>
                                </div>
                                <p className="text-orange-900 leading-relaxed font-medium">{med.sideEffects}</p>
                            </div>

                            {/* Safety Restrictions */}
                            <div className="bg-rose-50/80 rounded-[2rem] p-8 border border-rose-100 hover:bg-rose-100/80 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300 md:col-span-2 lg:col-span-1 group/item">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-500/30 group-hover/item:scale-110 transition-transform">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-extrabold text-rose-950 text-lg tracking-tight">Warning</h4>
                                </div>
                                <p className="text-rose-900 leading-relaxed font-medium">
                                    {med.restrictions}
                                </p>
                            </div>
                        </div>

                        {/* Age-Based Dosage Footer */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                                <UserRound className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                    <UserRound className="w-6 h-6 text-blue-200" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-blue-100">Recommended Dosage Guidelines</span>
                                </div>

                                <div className="w-full">
                                    {med.ageDosage && typeof med.ageDosage === 'object' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            {Object.entries(med.ageDosage).map(([age, dose]) => (
                                                <div key={age} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block mb-1">{age}</span>
                                                    <p className="font-semibold text-lg">{String(dose || "Consult Doctor")}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="font-medium text-lg leading-relaxed">{String(med.ageDosage || "See doctor for dosage")}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
