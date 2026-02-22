import { motion } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#000000] text-slate-400 py-12 px-4 border-t border-white/5 overflow-hidden">

            {/* Background radial gradient fading to black */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[200px] bg-brand-900/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center border border-brand-500/20">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-brand-500"
                        >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">SmartCity</span>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
                    <a href="#" className="hover:text-white transition-colors duration-300">About</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Cities</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Developers</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
                </div>

                <div className="flex gap-4 mb-10">
                    {["twitter", "github", "linkedin"].map((social, i) => (
                        <motion.a
                            key={social}
                            href={`#${social}`}
                            whileHover={{ scale: 1.1, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-400 transition-colors"
                        >
                            <span className="sr-only">{social}</span>
                            <div className="w-4 h-4 rounded-sm bg-current" /> {/* Placeholder for actual social icon SVG */}
                        </motion.a>
                    ))}
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                <div className="text-sm text-slate-600 text-center">
                    &copy; {currentYear} SmartCity Initiative. Open-source under MIT License.
                </div>
            </div>
        </footer>
    );
}
