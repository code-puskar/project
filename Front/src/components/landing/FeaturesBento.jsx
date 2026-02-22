import { motion } from "framer-motion";

export default function FeaturesBento() {
    return (
        <section className="py-24 px-4 bg-[#110e1b]" id="features">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">

                {/* 1. Real-time 3D Mapping (Large Left) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2rem] bg-[#1a1625] border border-white/5 flex flex-col justify-end p-10 group"
                >
                    {/* Abstract Globe Graphic */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[400px] h-[400px] rounded-full border border-violet-500/20 flex items-center justify-center relative shadow-[0_0_100px_rgba(139,92,246,0.1)]">
                            <div className="w-[300px] h-[300px] rounded-full border border-violet-500/10 flex items-center justify-center">
                                {/* Core Globe */}
                                <div className="w-16 h-16 rounded-full bg-violet-600/20 backdrop-blur-3xl flex items-center justify-center text-violet-500">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm6.91 8h-3.32a21.49 21.49 0 0 0-1.04-4.83A8.026 8.026 0 0 1 18.91 10ZM12 4.04a19.7 19.7 0 0 1 2.37 5.96h-4.74A19.7 19.7 0 0 1 12 4.04Zm-2.55 1.13A21.49 21.49 0 0 0 8.41 10H5.09a8.026 8.026 0 0 1 4.36-4.83ZM5.09 14h3.32a21.49 21.49 0 0 0 1.04 4.83A8.026 8.026 0 0 1 5.09 14Zm4.36 4.83A21.49 21.49 0 0 0 12 19.96a19.7 19.7 0 0 1-2.37-5.96h4.74a19.7 19.7 0 0 1 2.37 5.96 21.49 21.49 0 0 0 2.55-1.13A8.026 8.026 0 0 1 18.91 14h-3.32a21.49 21.49 0 0 0-1.04 4.83Z" />
                                    </svg>
                                </div>
                            </div>
                            {/* Moon/Satellite dot */}
                            <div className="absolute top-[15%] right-[20%] w-3 h-3 bg-slate-200 rounded-full shadow-[0_0_10px_white]" />
                            <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 bg-violet-500 rounded-full" />
                            <div className="absolute bottom-[35%] right-[15%] w-1 h-1 bg-violet-400 rounded-full" />
                        </div>
                    </div>

                    <div className="relative z-10 w-full flex justify-between items-end">
                        <div className="max-w-md">
                            <h3 className="text-3xl font-bold text-white mb-3">Real-time 3D Mapping</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                Interactive visualization of civic data across the globe. Monitor infrastructure health in real-time.
                            </p>
                        </div>
                        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-violet-600/20 items-center justify-center text-violet-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="7.5 4.21 12 6.81 16.5 4.21" /><polyline points="7.5 19.79 12 17.19 16.5 19.79" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Community Trust (Top Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-[2rem] bg-[#1a1625] border border-white/5 p-8 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-7.86l-2.765-2.767L7 12.431l3.118 3.121a1 1 0 001.414 0l5.952-5.95-1.062-1.062-5.6 5.6z" /></svg>
                            <span className="text-xs font-bold text-emerald-400 tracking-wider">VERIFIED CITIZEN</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Community Trust</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Earn reputation by validating reports and contributing to your neighborhood.
                        </p>
                    </div>

                    <div className="mt-6 bg-[#251e35] rounded-2xl p-6 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                            {/* SVG Donut Chart Mockup */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-emerald-400" strokeWidth="3" strokeDasharray="60, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-xl font-bold">Lvl 5</span>
                            </div>
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold">+150 pts this week</span>
                    </div>
                </motion.div>

                {/* 3. Instant Geocoding (Middle Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative overflow-hidden rounded-[2rem] bg-[#1a1625] border border-white/5 p-8 flex flex-col justify-center"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Instant Geocoding</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="w-full bg-[#110e1b] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="text-slate-200 text-sm flex-1">123 Main St<span className="animate-pulse">|</span></span>
                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400 font-mono">⌘K</div>
                        </div>
                        <div className="w-full bg-[#251e35] border border-violet-500/20 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-slate-300 text-xs">123 Main St, Tech District</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. AI Analysis (Bottom Right - spans to match grid) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="md:col-start-3 md:row-start-2 relative overflow-hidden rounded-[2rem] bg-[#1a1625] border border-white/5 p-6 flex flex-col justify-end group"
                >
                    {/* Background Cracked Earth Image Mockup */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-violet-900/40 mix-blend-multiply" />

                    {/* AI Bounding Box Overlay */}
                    <div className="absolute inset-4 border-2 border-violet-500/50 rounded-lg border-dashed bg-violet-500/10 pointer-events-none">
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-violet-600/80 backdrop-blur rounded text-[10px] font-mono text-white font-bold tracking-widest uppercase">
                            Confidence: 98%
                        </div>
                    </div>

                    <div className="relative z-10 w-full mt-auto pt-24">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">AI Analysis</h3>
                        <p className="text-slate-300 text-xs font-medium drop-shadow-md">Automated hazard detection.</p>
                    </div>
                </motion.div>

            </div>

            {/* Trusted By strip below features */}
            <div className="max-w-7xl mx-auto mt-24 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8">
                <span className="text-slate-500 text-sm mb-6 md:mb-0">Trusted by 50+ Municipalities worldwide</span>
                <div className="flex gap-8 opacity-20 grayscale">
                    {/* Mockup company pill blobs */}
                    <div className="w-24 h-8 bg-slate-400 rounded-full" />
                    <div className="w-24 h-8 bg-slate-400 rounded-full" />
                    <div className="w-24 h-8 bg-slate-400 rounded-full" />
                    <div className="w-24 h-8 bg-slate-400 rounded-full" />
                </div>
            </div>
        </section>
    );
}
