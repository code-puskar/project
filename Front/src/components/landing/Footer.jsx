import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="relative py-28 md:py-36 px-6 bg-[#060918] overflow-hidden">
            {/* Abstract glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">

                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/20 border border-white/10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </div>
                    <span className="text-3xl md:text-4xl font-black tracking-tight">safexcity</span>
                    <p className="text-blue-200/30 font-light max-w-sm mx-auto mt-3 text-sm">The civic intelligence suite powering the next generation of smart municipalities.</p>
                </motion.div>

                {/* Big CTA */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="mb-20 w-full flex justify-center"
                >
                    <button className="group relative px-8 py-5 md:px-12 md:py-6 bg-white/[0.03] rounded-3xl border border-white/[0.06] hover:border-blue-500/30 transition-colors shadow-2xl overflow-hidden flex items-center gap-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                        <div className="text-left relative z-10">
                            <div className="text-[10px] font-bold tracking-widest uppercase text-blue-400 mb-1">Join the network</div>
                            <div className="text-xl md:text-2xl font-black text-white">Start Building Today</div>
                        </div>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </button>
                </motion.div>

                {/* Bottom */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="w-full flex flex-col sm:flex-row justify-between items-center text-xs text-blue-200/20 font-medium border-t border-white/[0.04] pt-8 gap-4"
                >
                    <p>© 2026 Safexcity. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
