import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        id: 1,
        stepNo: "01",
        title: "Report Issues Instantly",
        description: "Snap a photo, tag the location, and submit directly to city council. Our AI automatically categorizes the issue for faster routing and eliminates duplicate reports.",
        icon: (
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-violet-400">
                <path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"></path>
            </svg>
        ),
        active: true, // For demo purposes, we hold step 1 active
    },
    {
        id: 2,
        stepNo: "02",
        title: "Community Validation",
        description: "Neighbors verify reports, prioritizing urgent fixes through collective voting. This ensures resources are allocated efficiently where they matter most to the community.",
        icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5 text-slate-400">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
            </svg>
        ),
        active: false,
    },
    {
        id: 3,
        stepNo: "03",
        title: "Resolution & Updates",
        description: "Track progress in real-time. Once the city crew resolves the issue, you receive a photo confirmation and the case is closed on the public map.",
        icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5 text-slate-400">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        ),
        active: false,
    }
];

export default function ScrollStory() {
    return (
        <section className="py-24 bg-[#110e1b] relative overflow-hidden flex flex-col items-center" id="how-it-works">

            {/* Background ambient glow */}
            <div className="absolute top-[30%] right-[10%] w-[600px] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none rounded-full" />

            {/* Section Header */}
            <div className="text-center mb-20 max-w-2xl px-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-[#1a1625] mb-6"
                >
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Live Beta</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                >
                    Your Voice, Our Action
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-400 leading-relaxed font-light"
                >
                    Transforming civic engagement through transparency. See how a simple report
                    becomes a resolved solution in three steps.
                </motion.p>
            </div>

            {/* Vertical Steps & Phone Mockup Layout */}
            <div className="max-w-6xl w-full mx-auto px-4 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">

                {/* Left Column: Vertical Steps */}
                <div className="w-full lg:w-1/2 flex flex-col relative py-8">
                    {/* Connecting Line */}
                    <div className="absolute left-[23px] top-12 bottom-12 w-px bg-white/5 z-0" />

                    {steps.map((step, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className={`relative z-10 flex gap-8 mb-16 last:mb-0 ${!step.active ? "opacity-40" : ""}`}
                            key={step.id}
                        >
                            {/* Icon Block */}
                            <div className={`mt-2 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-lg ${step.active ? "bg-violet-600 border-violet-500 shadow-violet-500/30" : "bg-[#1a1625] border-white/10"}`}>
                                {step.icon}
                            </div>

                            {/* Text Block */}
                            <div>
                                <span className="text-xs font-bold tracking-widest uppercase text-violet-500 mb-2 block">
                                    STEP {step.stepNo}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-slate-400 font-light leading-relaxed mb-6">
                                    {step.description}
                                </p>

                                {/* Additional UI details based on active step mockups */}
                                {step.id === 1 && (
                                    <div className="flex gap-3">
                                        <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2 text-xs text-slate-300">
                                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Geo-Tagging
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2 text-xs text-slate-300">
                                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                            AI Detection
                                        </div>
                                    </div>
                                )}

                                {step.id === 2 && (
                                    <div className="w-full max-w-md p-3 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center gap-3">
                                        <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                                        <span className="text-xs text-violet-300">Issues with high validation get 2x priority score.</span>
                                    </div>
                                )}

                                {step.id === 3 && (
                                    <a href="#map" className="inline-flex items-center gap-2 text-sm text-violet-500 font-semibold hover:text-violet-400 transition-colors">
                                        View Resolved Map
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Column: Phone Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2 flex justify-center items-center lg:justify-end relative"
                >
                    {/* Status Pill floating next to phone */}
                    <div className="absolute right-0 top-[20%] z-20 hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a1625] border border-white/10 shadow-2xl translate-x-1/2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-7.86l-2.765-2.767L7 12.431l3.118 3.121a1 1 0 001.414 0l5.952-5.95-1.062-1.062-5.6 5.6z" /></svg>
                        </div>
                        <div>
                            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Status</div>
                            <div className="text-xs text-white font-semibold">Live Preview</div>
                        </div>
                    </div>

                    {/* The Phone Container */}
                    <div className="relative w-[320px] h-[650px] bg-[#1a1625] rounded-[2.5rem] border-[4px] border-[#251e35] shadow-2xl overflow-hidden shadow-violet-500/10">

                        {/* Top Top bar */}
                        <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-black/50 to-transparent z-30 pointer-events-none flex justify-between px-6 pt-4 text-[10px] font-medium text-white">
                            <span>9:41</span>
                            <div className="flex gap-1.5 items-center">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L.82 5.56A15.42 15.42 0 0 1 12 2a15.42 15.42 0 0 1 11.18 3.56z" /></svg>
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M22 10v4" /></svg>
                            </div>
                        </div>

                        {/* Camera notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#251e35] rounded-b-xl z-40" />

                        {/* App Content */}
                        <div className="relative w-full h-full bg-[#110e1b] flex flex-col">

                            {/* Map Portion */}
                            <div className="relative flex-1 bg-slate-800 overflow-hidden">
                                {/* Dummy Map Image */}
                                <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/13/2340/3015.png')] bg-cover bg-center mix-blend-luminosity opacity-40" />
                                <div className="absolute inset-0 bg-violet-900/40 mix-blend-overlay" />

                                {/* Scanning box UI */}
                                <div className="absolute inset-10 border border-emerald-500/50 rounded-lg flex items-start justify-center pt-8">
                                    <div className="px-3 py-1 bg-slate-900/80 backdrop-blur rounded-full border border-white/10 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">Damage Detected</span>
                                    </div>
                                </div>

                                {/* Center Map Pin */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <svg className="w-8 h-8 text-violet-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                                </div>
                            </div>

                            {/* Bottom Slide-up Panel */}
                            <div className="relative h-[280px] bg-[#1a1625] rounded-t-3xl -mt-6 z-20 flex flex-col p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">Pothole</h4>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            124 Main St, Downtown
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-6 overflow-hidden">
                                    <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 text-slate-400 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-[8px] font-bold tracking-wider">Add More</span>
                                    </div>
                                    {/* Dummy Photos */}
                                    <div className="w-16 h-16 rounded-xl bg-slate-800 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center shrink-0 border border-white/10" />
                                    <div className="w-16 h-16 rounded-xl bg-slate-800 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center opacity-50 shrink-0 border border-white/10" />
                                </div>

                                <button className="w-full py-3.5 bg-violet-600 rounded-xl font-bold text-white shadow-lg shadow-violet-500/20 text-sm flex items-center justify-center gap-2">
                                    Submit Report
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Analytics & Alerts Cards */}
            <div className="max-w-6xl w-full mx-auto px-4 mt-24 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Transparent Analytics (spans 2 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="col-span-1 md:col-span-2 rounded-[2rem] bg-[#1a1625] border border-white/5 p-8 flex flex-col justify-between overflow-hidden relative"
                >
                    <div className="max-w-md relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Transparent Analytics</h3>
                        <p className="text-sm text-slate-400 font-light leading-relaxed">
                            Access city-wide data on infrastructure health. See where tax dollars are going with real-time budget tracking on verified issues.
                        </p>
                    </div>

                    <div className="mt-16 flex items-end gap-12 relative z-10">
                        <div>
                            <div className="text-3xl font-black text-white">12.4k</div>
                            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Reports Solved</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-violet-400">-45%</div>
                            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Response Time</div>
                        </div>
                    </div>

                    {/* Abstract Bar Chart Decoration */}
                    <div className="absolute bottom-0 right-8 h-32 w-64 flex items-end gap-2 opacity-50">
                        {[30, 40, 20, 60, 25].map((h, i) => (
                            <div key={i} className="flex-1 bg-violet-600/40 rounded-t-xl mix-blend-screen" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </motion.div>

                {/* City Alerts (1 col) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 rounded-[2rem] bg-[#1a1625] border border-white/5 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                    {/* Radial glow */}
                    <div className="absolute inset-0 bg-radial-gradient from-violet-600/10 to-transparent pointer-events-none" />

                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mb-6 relative z-10">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-4H7V8h10v2z" /></svg>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">City Alerts</h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed relative z-10">
                        Get notified about road closures, emergencies, and town halls instantly.
                    </p>
                </motion.div>
            </div>

        </section>
    );
}
