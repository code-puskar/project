import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

function AnimatedNumber({ value }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2000
    });

    const display = useTransform(springValue, (current) => Math.floor(current).toLocaleString());

    useEffect(() => {
        if (isInView) {
            springValue.set(value);
        }
    }, [isInView, springValue, value]);

    return <motion.span ref={ref}>{display}</motion.span>;
}

export default function StatsBar() {
    return (
        <section className="py-24 bg-[#110e1b] relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

                {/* Stat 1 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#1a1625] border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-violet-500/20 transition-colors"
                >
                    <div className="w-14 h-14 rounded-full bg-violet-900 flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center">
                        <AnimatedNumber value={5000} />+
                    </div>
                    <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Issues Resolved</div>
                </motion.div>

                {/* Stat 2 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1a1625] border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-violet-500/20 transition-colors"
                >
                    <div className="w-14 h-14 rounded-full bg-violet-900 flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center">
                        10k+
                    </div>
                    <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Active Citizens</div>
                </motion.div>

                {/* Stat 3 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1a1625] border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:border-violet-500/20 transition-colors"
                >
                    <div className="w-14 h-14 rounded-full bg-violet-900 flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z" /></svg>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center">
                        12ms
                    </div>
                    <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Response Time</div>
                </motion.div>

            </div>
        </section>
    );
}
