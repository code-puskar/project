import { motion } from "framer-motion";

export default function Hero({ onOpenLogin, onOpenRegister }) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

            {/* Abstract background shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 py-6 px-6 md:px-12 flex justify-between items-center z-50 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">safexcity</span>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={(e) => { e.preventDefault(); onOpenLogin(); }} className="text-sm font-semibold text-blue-200/70 hover:text-white transition-colors">Login</button>
                    <button onClick={(e) => { e.preventDefault(); onOpenRegister(); }} className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 flex items-center gap-2">
                        Get Started
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-24">

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm mb-8"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-blue-300 tracking-wider uppercase">Civic Intelligence Suite</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.95]"
                >
                    The Brains of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Modern Cities</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-blue-200/50 max-w-2xl font-light mb-12 leading-relaxed"
                >
                    Report, track, and resolve infrastructure issues instantly. True transparency through the synergy of <strong className="text-blue-200/80 font-semibold">AI</strong> and <strong className="text-blue-200/80 font-semibold">community data</strong>.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-10"
                >
                    <button onClick={(e) => { e.preventDefault(); onOpenRegister(); }}
                        className="px-8 py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1 "
                    >Unite your City</button>
                    <button className="px-8 py-4 rounded-2xl font-bold bg-white/5 text-blue-100 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        Explore Platform
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-blue-300/40 font-bold">Scroll</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-5 h-8 rounded-full border-2 border-blue-400/30 flex justify-center pt-1.5">
                    <div className="w-1 h-1.5 bg-blue-400/60 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
