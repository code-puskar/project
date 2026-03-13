import { motion } from "framer-motion";

export default function CTASection({ onOpenLogin, onOpenRegister }) {
    return (
        <section className="relative px-6 py-20 md:py-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_30px_120px_-45px_rgba(0,0,0,0.8)] px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                            Civic response ready
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">Primary call to action</h3>
                        <p className="text-blue-200/60 max-w-xl">
                            Deploy a professional-grade reporting flow, or jump straight into the live map to triage open cases.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={(e) => { e.preventDefault(); onOpenRegister?.(); }}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-600/25 hover:-translate-y-0.5"
                        >
                            Report an Issue
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); onOpenLogin?.(); }}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold bg-white/5 text-blue-100 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            View Map
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
