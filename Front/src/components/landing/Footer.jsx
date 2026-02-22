import { motion } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#110e1b] text-slate-400 py-16 px-4 border-t border-white/5 relative overflow-hidden">

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">

                {/* Left Column: Branding (Spans 5 cols) */}
                <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">safexcity</span>
                    </div>

                    <p className="text-slate-400 font-light leading-relaxed mb-8 max-w-sm">
                        Empowering citizens with next-gen civic technology. Real-time reporting, transparent resolutions, and a cleaner future.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-[#1a1625] mb-6">
                        <div className="w-2 h-2 rounded-full bg-violet-600" />
                        <span className="text-xs font-semibold text-violet-400">Built for the Future</span>
                    </div>
                </div>

                {/* Middle/Right Columns */}
                <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Platform</h4>
                        <a href="#" className="text-sm hover:text-white transition-colors">Live Map</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Issue Tracker</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">City Dashboard</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Mobile App</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Resources</h4>
                        <a href="#" className="text-sm hover:text-white transition-colors">Documentation</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">API Reference</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Community Guide</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Open Data</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold mb-2">Legal</h4>
                        <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full h-px border-t border-white/5 my-10" />

            {/* Bottom Legal / Social Strip */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-xs text-slate-500">
                    &copy; {currentYear} safexcity. All rights reserved.
                </div>

                <div className="flex gap-4 text-slate-400">
                    {/* Social Icons matching mockup */}
                    <motion.a href="#" whileHover={{ y: -2 }} className="w-10 h-10 rounded-full bg-[#1a1625] flex items-center justify-center hover:bg-violet-600/20 hover:text-violet-400 border border-transparent hover:border-violet-500/20 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </motion.a>
                    <motion.a href="#" whileHover={{ y: -2 }} className="w-10 h-10 rounded-full bg-[#1a1625] flex items-center justify-center hover:bg-violet-600/20 hover:text-violet-400 border border-transparent hover:border-violet-500/20 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </motion.a>
                    <motion.a href="#" whileHover={{ y: -2 }} className="w-10 h-10 rounded-full bg-[#1a1625] flex items-center justify-center hover:bg-violet-600/20 hover:text-violet-400 border border-transparent hover:border-violet-500/20 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.187 0 7.429 2.969 7.429 6.945 0 4.155-2.617 7.509-6.255 7.509-1.222 0-2.373-.637-2.766-1.385l-.754 2.872c-.273 1.042-1.01 2.348-1.503 3.143 1.14.316 2.337.487 3.568.487 6.621 0 11.988-5.367 11.988-11.987C24.006 5.367 18.638 0 12.017 0z" /></svg>
                    </motion.a>
                </div>
            </div>
        </footer>
    );
}
