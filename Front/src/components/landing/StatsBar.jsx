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
        <section className="py-20 bg-slate-900 border-y border-white/10 relative overflow-hidden">

            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-around items-center gap-12 md:gap-4">

                <div className="text-center">
                    <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-1">
                        <AnimatedNumber value={15340} />
                        <span className="text-brand-400">+</span>
                    </div>
                    <div className="text-slate-400 font-medium tracking-wider uppercase text-sm">Issues Resolved</div>
                </div>

                <div className="hidden md:block w-px h-16 bg-white/10" />

                <div className="text-center">
                    <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-1">
                        <AnimatedNumber value={25000} />
                        <span className="text-emerald-400">+</span>
                    </div>
                    <div className="text-slate-400 font-medium tracking-wider uppercase text-sm">Active Citizens</div>
                </div>

                <div className="hidden md:block w-px h-16 bg-white/10" />

                <div className="text-center">
                    <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-1">
                        $<AnimatedNumber value={1.2} />M
                    </div>
                    <div className="text-slate-400 font-medium tracking-wider uppercase text-sm">Taxpayer Savings</div>
                </div>

            </div>
        </section>
    );
}
