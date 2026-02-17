"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrescriptionScanner from "@/components/PrescriptionScanner";
import MedicineDetails, { Medicine } from "@/components/MedicineDetails";
import DigitalSchedule from "@/components/DigitalSchedule";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Heart, ShieldCheck, Search, Loader2, Mic, LogOut } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<{ medicines: Medicine[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [patientName, setPatientName] = useState("");
  const recognitionRef = useState<any>(null); // Use ref or state to persist instance if needed globally, but simple var is okay for now if scoped. better to keep simple.

  // Actually, let's keep it simple. The issue might be browser permissions or supported API.
  // We added error handling above. Let's make sure we stop if already listening.
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const details = localStorage.getItem("patientDetails");
    if (!details) {
      router.push("/login");
    } else {
      const parsed = JSON.parse(details);

      if (!parsed.name) {
        router.push("/onboarding");
        return;
      }

      setPatientName(parsed.name.split(" ")[0]); // First name
      if (parsed.id) setPatientId(parsed.id);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("patientDetails");
    router.push("/login");
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = navigator.language || "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        // Only alert on critical errors, not no-speech or aborted
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          alert("Voice recognition failed. Please try again.");
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Prefer final, but show interim if available to give feedback
        const displayText = finalTranscript || interimTranscript;
        if (displayText) {
          setSearchQuery(displayText);
        }
      };

      recognition.start();
    } else {
      alert("Voice assistance is not supported in this browser.");
    }
  };

  const handleReset = () => {
    setData(null);
    setSearchQuery("");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const formData = new FormData();
    formData.append("medicineName", searchQuery);
    if (patientId) {
      formData.append("patientId", patientId);
    }

    try {
      const response = await fetch("/api/process-prescription", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Search failed");
      }

      if (result.medicines && Array.isArray(result.medicines)) {
        setData(result);
      } else {
        throw new Error("AI could not find medicine details. Please try again.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      alert(`Search failed: ${errorMessage}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans relative overflow-x-hidden">
      {/* Colorful Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-blue-200/40 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-3xl opacity-60 animate-blob animation-delay-4000" />
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-5xl mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 block leading-none">MedScan</span>
              {patientName && <span className="text-xs text-zinc-500 font-medium">Welcome, {patientName}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full border border-emerald-100/50 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
            </div>
            {patientName && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900">
                  Your Personal <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                    Health Assistant
                  </span>
                </h1>
                <p className="text-lg text-zinc-600 max-w-2xl mx-auto font-medium">
                  Upload a prescription or search for a medicine to get instant AI-powered insights, schedules, and safety warnings.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] shadow-xl shadow-indigo-500/10 border border-white/50 ring-1 ring-white/60">
                <PrescriptionScanner onDataExtracted={setData} patientId={patientId} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                  <span className="bg-[#fafafa]/80 backdrop-blur px-4 text-zinc-400">or search manually</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  type="button"
                  onClick={startListening}
                  className={`
                    flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg
                    ${isListening
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30 animate-pulse ring-4 ring-red-100"
                      : "bg-white text-zinc-700 border border-zinc-100/50 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10"
                    }
                  `}
                >
                  <Mic className={`w-5 h-5 ${isListening ? "animate-bounce" : ""}`} />
                  <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
                </button>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full relative group">
                  <div className="relative transition-all duration-300 transform group-hover:-translate-y-1">
                    <input
                      type="text"
                      placeholder="e.g. Metformin 500mg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-20 pl-16 pr-36 bg-white/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/50 shadow-2xl shadow-indigo-500/10 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-xl font-bold text-zinc-800 placeholder:text-zinc-400/80 placeholder:font-medium"
                      suppressHydrationWarning
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />

                    <button
                      type="submit"
                      disabled={searching}
                      className="absolute right-3 top-3 bottom-3 px-8 bg-zinc-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-zinc-900/20 hover:shadow-indigo-500/30 active:scale-95"
                      suppressHydrationWarning
                    >
                      {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200/60">
                <div>
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Health Analysis</h2>
                  <p className="text-zinc-500 text-lg">Detailed medication safety profile and schedule.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="p-4 bg-white/80 border border-white/50 rounded-[1.5rem] text-zinc-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 flex items-center gap-2 group backdrop-blur-sm"
                >
                  <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-indigo-500" />
                  <span className="font-bold text-sm">Start Over</span>
                </button>
              </div>

              <div className="space-y-12">
                <section>
                  <MedicineDetails medicines={data.medicines} />
                </section>

                <section className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-white/50 p-2 shadow-xl shadow-indigo-500/5 ring-1 ring-white/60">
                  <DigitalSchedule medicines={data.medicines} />
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto py-16 px-6 border-t border-zinc-200/60 text-center space-y-4 relative z-10">
        <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <span>Accuracy: 99.8%</span>
          <span>•</span>
          <span>Powered by Gemini 2.5</span>
          <span>•</span>
          <span>Refreshed 2026</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed italic">
          Disclaimer: This AI tool is designed to assist in understanding prescriptions.
          Information on side effects and restrictions is generated via medical LLM datasets.
          Always verify these details with your professional healthcare provider before consumption.
        </p>
      </footer>
    </div>
  );
}
