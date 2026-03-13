import { motion } from "framer-motion";

const features = [
    {
        title: "Easy Road Issue Reporting",
        desc: "File pothole, signage, and lighting reports in seconds with guided inputs and auto-location capture.",
        accent: "blue",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7" />
            </svg>
        ),
    },
    {
        title: "Real-Time Map Tracking",
        desc: "Visualize every submission on a live map with filtering by severity, department, and resolution stage.",
        accent: "cyan",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" />
                <circle cx="12" cy="11" r="3" />
            </svg>
        ),
    },
    {
        title: "Transparent Status Updates",
        desc: "Automatic notifications when issues are triaged, dispatched, and closed—with evidence attached.",
        accent: "violet",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                <rect width="18" height="14" x="3" y="5" rx="3" />
            </svg>
        ),
    },
];

const accents = {
    blue: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 text-blue-200",
    cyan: "from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 text-cyan-200",
    violet: "from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/20 text-violet-200",
};

export default function FeatureColumns() {
    return (
        <section id="features" className="relative py-24 md:py-32 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_45%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">
                        Feature Highlights
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">Built for rapid civic response</h2>
                    <p className="text-blue-200/50 max-w-2xl mx-auto font-light">
                        Three pillars designed around how cities actually work: capture, visualize, and resolve.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const accent = accents[feature.accent];
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-7 shadow-2xl shadow-black/20 overflow-hidden`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b ${accent}`} />
                                <div className="relative z-10 space-y-4">
                                    <div className={`w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="text-blue-200/60 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
