import { motion } from "framer-motion";

const features = [
    {
        tag: "01 — Visualization",
        title: "Real-time 3D Mapping",
        desc: "Interactive visualization of civic data across the globe. Monitor infrastructure health in real-time with stunning clarity.",
        color: "blue",
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.91 8h-3.32a21.49 21.49 0 0 0-1.04-4.83A8.03 8.03 0 0 1 18.91 10ZM12 4.04A19.7 19.7 0 0 1 14.37 10h-4.74A19.7 19.7 0 0 1 12 4.04ZM5.09 14h3.32a21.49 21.49 0 0 0 1.04 4.83A8.03 8.03 0 0 1 5.09 14Zm9.46 4.83A21.49 21.49 0 0 0 15.59 14h3.32a8.03 8.03 0 0 1-4.36 4.83Z" /></svg>
        ),
    },
    {
        tag: "02 — Verification",
        title: "Community Trust",
        desc: "Earn reputation by validating reports and contributing to your neighborhood. Your impact, dynamically quantified.",
        color: "indigo",
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
        ),
    },
    {
        tag: "03 — Accuracy",
        title: "Instant Geocoding",
        desc: "Our advanced geocoding engine translates unstructured data to pinpoint coordinates in milliseconds.",
        color: "cyan",
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
        ),
    },
    {
        tag: "04 — Intelligence",
        title: "Automated Analysis",
        desc: "Hazard detection trained on millions of municipal data points. We spot the issue before you even submit.",
        color: "violet",
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
        ),
    },
];

const colorMap = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", gradient: "from-blue-500/20 to-transparent" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", gradient: "from-indigo-500/20 to-transparent" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", gradient: "from-cyan-500/20 to-transparent" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", gradient: "from-violet-500/20 to-transparent" },
};

export default function FeaturesBento() {
    return (
        <section className="relative py-28 md:py-36 px-6 bg-[#060918] overflow-hidden">
            {/* Abstract glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-4 block">Platform Capabilities</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything you need</h2>
                    <p className="text-blue-200/40 max-w-lg mx-auto font-light">A comprehensive suite of tools built for modern municipal governance.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((f, i) => {
                        const c = colorMap[f.color];
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 md:p-10 group hover:border-white/10 transition-all relative overflow-hidden"
                            >
                                {/* Hover gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                <div className="relative z-10">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase ${c.text} mb-6 block`}>{f.tag}</span>
                                    <div className={`w-16 h-16 rounded-2xl ${c.bg} ${c.border} border ${c.text} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">{f.title}</h3>
                                    <p className="text-blue-200/40 font-light leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
