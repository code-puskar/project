import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        id: 1,
        title: "1. Snap & Report",
        description: "See a pothole or broken streetlight? Snap a photo, add a quick description, and our system automatically tags your exact GPS coordinates.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: 2,
        title: "2. Community Validation",
        description: "Fellow citizens can view and upvote your issue. A gamified consensus model ensures that real problems bubble up to the top priority instantly.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        id: 3,
        title: "3. Swift Resolution",
        description: "City officials receive validated data directly to their dashboard. Once fixed, the map updates to green, proving the power of community action.",
        color: "from-purple-500 to-pink-500",
    }
];

export default function ScrollStory() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate which step is currently active based on scroll progress
    // 0 to 0.33 -> Step 1
    // 0.33 to 0.66 -> Step 2
    // > 0.66 -> Step 3

    return (
        <section
            ref={containerRef}
            className="relative bg-slate-900"
            id="how-it-works"
            style={{ height: "300vh" }} // 3 viewports tall to allow scrolling
        >
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden px-4 md:px-12 py-20">

                {/* Left Side: Text Content that fades based on scroll */}
                <div className="w-full md:w-1/2 flex flex-col justify-center h-full max-w-xl relative">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-12"
                    >
                        How It Works
                    </motion.h2>

                    <div className="relative h-[400px]">
                        {steps.map((step, index) => {
                            // Each step is visible for a third of the scroll
                            const start = index * 0.33;
                            const end = (index + 1) * 0.33;

                            // When scrollYProgress is within start and end, opacity is 1, else 0.
                            const opacity = useTransform(
                                scrollYProgress,
                                [start - 0.05, start, end - 0.05, end],
                                [0, 1, 1, 0]
                            );

                            const y = useTransform(
                                scrollYProgress,
                                [start - 0.05, start, end - 0.05, end],
                                [20, 0, 0, -20]
                            );

                            return (
                                <motion.div
                                    key={step.id}
                                    style={{ opacity, y }}
                                    className="absolute inset-0 flex flex-col justify-center"
                                >
                                    <h3 className={`text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xl text-slate-300 leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Phone Mockup that changes visual state */}
                <div className="w-full md:w-1/2 h-full flex items-center justify-center">
                    <div className="relative w-[300px] h-[600px] rounded-[3rem] border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden shadow-brand-500/20">
                        {/* iPhone Notch */}
                        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-50"></div>

                        {/* Screen Content */}
                        <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden">
                            {/* Decorative map background for the phone */}
                            <div className="absolute inset-0 opacity-30 bg-[url('https://maps.wikimedia.org/osm-intl/12/1209/1539.png')] bg-cover bg-center grayscale" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900" />

                            {steps.map((step, index) => {
                                const start = index * 0.33;
                                const end = (index + 1) * 0.33;

                                const opacity = useTransform(
                                    scrollYProgress,
                                    [start - 0.05, start, end - 0.05, end],
                                    [0, 1, 1, 0]
                                );
                                const scale = useTransform(
                                    scrollYProgress,
                                    [start, start + 0.1],
                                    [0.8, 1]
                                );

                                return (
                                    <motion.div
                                        key={step.id}
                                        style={{ opacity, scale }}
                                        className="absolute inset-0 flex items-center justify-center p-6"
                                    >
                                        <div className={`w-full p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl flex flex-col items-center justify-center`}>
                                            {index === 0 && (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    </div>
                                                    <div className="h-4 w-3/4 bg-slate-700 rounded mb-2"></div>
                                                    <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <div className="w-full flex justify-between items-center mb-2">
                                                        <div className="h-4 w-1/2 bg-emerald-800 rounded"></div>
                                                        <span className="text-emerald-400 font-bold">+12</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-3/4"></div>
                                                    </div>
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                                                    </div>
                                                    <div className="text-white font-medium mb-1">Issue Resolved</div>
                                                    <div className="text-xs text-slate-400">Map updated automatically.</div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
