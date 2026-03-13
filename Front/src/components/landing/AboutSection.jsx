import { motion } from "framer-motion";

const pillars = [
    { title: "Civic engagement", desc: "Citizen-first flows that reward participation and build trust between residents and officials." },
    { title: "Operational clarity", desc: "Issue lifecycle shared with public dashboards, SLAs, and automated updates." },
    { title: "Impact focus", desc: "Data stories that show where budget is landing and how neighborhoods improve over time." },
];

export default function AboutSection() {
    return (
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
            <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
                        About the platform
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                        Built for cities that want more than ticketing
                    </h2>
                    <p className="text-blue-200/60 font-light leading-relaxed">
                        Safexcity combines AI-powered detection with human validation so municipal teams get clean, actionable data.
                        The result: faster fixes, transparent accountability, and engaged communities.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {pillars.map((pillar, idx) => (
                        <div key={pillar.title} className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 h-full shadow-2xl shadow-black/20 hover:border-white/15 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200/80 text-xs font-bold">
                                        {String(idx + 1).padStart(2, "0")}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                                </div>
                                <p className="text-blue-200/60 text-sm leading-relaxed">{pillar.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
