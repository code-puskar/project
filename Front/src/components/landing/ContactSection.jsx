import { motion } from "framer-motion";

const contacts = [
    {
        label: "Email",
        value: "support@safexcity.gov",
        hint: "General inquiries and onboarding",
    },
    {
        label: "Phone",
        value: "+1 (415) 555-0149",
        hint: "Weekdays, 9:00-18:00 PST",
    },
    {
        label: "Service desk",
        value: "Open a ticket",
        hint: "Priority support for city partners",
        badge: "SLA",
    },
];

export default function ContactSection() {
    return (
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(109,40,217,0.08),transparent_45%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-3 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
                        Contact
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">Talk with the team</h2>
                    <p className="text-blue-200/60 max-w-2xl mx-auto font-light">
                        Reach out for implementation help, data questions, or to book a live demo.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contacts.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl shadow-black/20 hover:border-blue-500/25 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold tracking-[0.16em] uppercase text-blue-200/60">{item.label}</span>
                                {item.badge && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <div className="text-white text-lg font-semibold">{item.value}</div>
                            <p className="text-blue-200/50 text-sm mt-1">{item.hint}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
