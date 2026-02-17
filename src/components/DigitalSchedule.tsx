import { Bell, Clock, Calendar, Pill } from "lucide-react";
import { motion } from "framer-motion";

interface Medicine {
    name: string;
    dosage: string;
    schedule: string[];
}

interface DigitalScheduleProps {
    medicines: Medicine[];
}

export default function DigitalSchedule({ medicines }: DigitalScheduleProps) {
    // Flatten and sort the schedule
    const fullSchedule = medicines.flatMap(med =>
        (med.schedule || []).map(time => ({
            time,
            medName: med.name,
            dosage: med.dosage
        }))
    ).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="w-full p-2 space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-2xl">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Today's Schedule</h2>
                        <p className="text-zinc-500 font-medium">Auto-generated from your prescriptions</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-95 group">
                    <Bell className="w-4 h-4 group-hover:swing" />
                    <span className="font-bold text-sm">Set Reminders</span>
                </button>
            </div>

            <div className="space-y-6">
                {fullSchedule.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative flex gap-8 group"
                    >
                        {/* Time Node */}
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-50 z-10 group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300">
                                <span className="text-sm font-black text-indigo-600">{item.time}</span>
                            </div>
                            {idx !== fullSchedule.length - 1 && (
                                <div className="w-0.5 grow bg-gradient-to-b from-indigo-100 to-transparent my-2 group-hover:from-indigo-300 transition-colors" />
                            )}
                        </div>

                        {/* Card */}
                        <div className="flex-1 pb-8">
                            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 relative group/card cursor-pointer">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                </div>

                                <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover/card:text-indigo-600 transition-colors">{item.medName}</h3>
                                <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium bg-zinc-50 w-fit px-3 py-1 rounded-full border border-zinc-100/50">
                                    <Pill className="w-3 h-3" />
                                    {item.dosage}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {fullSchedule.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400 bg-zinc-50/50 rounded-[2.5rem] border-3 border-dashed border-zinc-200">
                        <div className="p-4 bg-zinc-100 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-zinc-300" />
                        </div>
                        <p className="font-bold text-lg text-zinc-500">No medicines scheduled</p>
                        <p className="text-sm">Scan a prescription to generate your timeline</p>
                    </div>
                )}
            </div>
        </div>
    );
}
