import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

function AnimatedNumber({ value }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const springValue = useSpring(0, { stiffness: 50, damping: 20, duration: 2500 });
    const display = useTransform(springValue, (c) => Math.floor(c).toLocaleString());
    useEffect(() => { if (isInView) springValue.set(value); }, [isInView, springValue, value]);
    return <motion.span ref={ref}>{display}</motion.span>;
}

const stats = [
    {
        value: 15, suffix: "k+", label: "Issues Resolved", color: "blue",
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
    },
    {
        value: 250, suffix: "k+", label: "Active Citizens", color: "indigo",
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
    },
    {
        value: 12, suffix: "ms", label: "AI Response Time", color: "cyan",
        icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z" /></svg>
    },
];

const colorMap = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", glow: "shadow-indigo-500/10" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
};

export default function StatsBar() {
    return (
        <section className="relative py-28 md:py-36 px-6 overflow-hidden">
            {/* Abstract shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4 block">Proven at Scale</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Numbers that matter</h2>
                    <p className="text-blue-200/40 max-w-lg mx-auto font-light">Real impact verified by citizens and public officials globally.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((s, i) => {
                        const c = colorMap[s.color];
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center group hover:border-white/10 transition-colors shadow-2xl ${c.glow}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.text} ${c.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {s.icon}
                                </div>
                                <div className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter flex items-center">
                                    <AnimatedNumber value={s.value} />{s.suffix}
                                </div>
                                <div className="text-xs font-bold tracking-widest text-blue-200/30 uppercase">{s.label}</div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
