import { motion } from "framer-motion";

const steps = [
    {
        no: "01",
        title: "Report Issues Instantly",
        desc: "Snap a photo, tag the location, and submit. Our AI categorizes it automatically.",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10z" /></svg>,
    },
    {
        no: "02",
        title: "Community Validation",
        desc: "Neighbors verify reports, prioritizing urgent fixes. Resources go where they matter most.",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    },
    {
        no: "03",
        title: "Resolution & Updates",
        desc: "Track progress in real-time. Get photo confirmation once resolved.",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    },
];

export default function ScrollStory() {
    return (
        <section className="relative py-28 md:py-36 px-6 bg-[#0a0f1f] overflow-hidden">
            {/* Abstract shapes */}
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">

                    {/* Left: Phone Mockup */}
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="w-full md:w-5/12 flex justify-center"
                    >
                        <div className="relative w-[280px] h-[560px] bg-[#0d1225] rounded-[3rem] border-[5px] border-white/[0.06] shadow-2xl shadow-blue-900/20 overflow-hidden">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#060918] rounded-b-2xl z-40" />
                            {/* Status bar */}
                            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black/60 to-transparent z-30 flex justify-between px-6 pt-4 text-[9px] font-bold text-white/60">
                                <span>9:41</span>
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-3 h-2 border border-white/40 rounded-sm"><div className="w-1.5 h-full bg-white/40 rounded-sm" /></div>
                                </div>
                            </div>

                            {/* Map area */}
                            <div className="relative h-[55%] bg-[#0d1225]">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1225]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom panel */}
                            <div className="relative h-[45%] bg-[#0d1225] rounded-t-3xl border-t border-white/[0.06] p-5 flex flex-col">
                                <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4" />
                                <h4 className="text-white font-bold text-sm mb-1">Hazard Report</h4>
                                <p className="text-blue-200/30 text-[10px] mb-4 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /></svg>
                                    124 Main St, Tech District
                                </p>
                                <div className="flex gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center text-blue-200/30">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a48 48 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.19 2.19 0 00-1.736-1.039 48.8 48.8 0 00-5.232 0 2.19 2.19 0 00-1.736 1.039z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                </div>
                                <button className="mt-auto w-full py-2.5 bg-blue-600 rounded-xl text-white text-xs font-bold shadow-lg shadow-blue-600/20">File Submission</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Steps */}
                    <div className="w-full md:w-7/12">
                        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 mb-6"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">How it works</span>
                        </motion.div>

                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black tracking-tight mb-12"
                        >
                            Your Voice,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Our Action</span>
                        </motion.h2>

                        <div className="flex flex-col gap-8 relative">
                            {/* Connecting line */}
                            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-white/[0.06]" />

                            {steps.map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                    className="flex gap-5 relative z-10 group"
                                >
                                    <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] text-blue-400 group-hover:border-blue-500/30 transition-colors">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                                        <p className="text-blue-200/40 font-light text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
