import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full bg-[#110e1b] flex flex-col items-center pt-32 pb-20 px-4 overflow-hidden">

            {/* Background ambient glow matching the mockup */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none rounded-full" />

            {/* Navbar specifically for the landing page (mimicking the top of the mockup) */}
            <nav className="absolute top-0 left-0 right-0 py-6 px-8 flex justify-between items-center z-50 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">safexcity</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#community" className="hover:text-white transition-colors">Community</a>
                    <a href="#government" className="hover:text-white transition-colors">Government</a>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={(e) => { e.preventDefault(); onOpenLogin(); }} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</button>
                    <button onClick={(e) => { e.preventDefault(); onOpenRegister(); }} className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
                        Get Started
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </nav>

            {/* Hero Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center mt-12 max-w-4xl">

                {/* v2.0 Live Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 mb-8"
                >
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">v2.0 Now Live</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6 leading-[1.1]"
                >
                    The Operating System for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        Modern Cities
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl font-light mb-12 leading-relaxed"
                >
                    Report, track, and resolve civic issues with the power of AI and community.
                    Join the network of future-ready citizens today.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button onClick={(e) => { e.preventDefault(); onOpenRegister(); }} className="px-8 py-4 rounded-xl font-bold bg-white text-[#110e1b] hover:bg-slate-200 transition-colors shadow-lg">
                        Explore Features
                    </button>
                    <a href="#features" className="px-8 py-4 rounded-xl font-bold bg-[#1a1625] text-white border border-white/10 hover:bg-[#251e35] transition-colors flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Watch Demo
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
