import { motion } from "framer-motion";

const features = [
    {
        title: "Real-time 3D Mapping",
        description: "Visualize urban infrastructure with stunning, true-to-life 3D terrain and satellite imagery powered by Cesium and Mapbox.",
        icon: (
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        span: "md:col-span-2 md:row-span-2",
        delay: 0.1,
    },
    {
        title: "Community Validation",
        description: "Build trust through a gamified reputation system. Upvote legitimate hazards to prioritize city response.",
        icon: (
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        span: "md:col-span-1 md:row-span-1",
        delay: 0.2,
    },
    {
        title: "Instant Geocoding",
        description: "Pinpoint issues precisely with our lightning-fast Mapbox search integration.",
        icon: (
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        span: "md:col-span-1 md:row-span-1",
        delay: 0.3,
    }
];

export default function FeaturesBento() {
    return (
        <section className="py-24 px-4 bg-slate-900 overflow-hidden" id="features">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Redefining Civic Engagement
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        Powerful tools designed for transparency, speed, and accuracy.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`relative overflow-hidden rounded-3xl p-8 bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col justify-end group cursor-pointer ${feature.span}`}
                        >
                            {/* Subtle gradient hover effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-transparent to-brand-500/0 group-hover:from-brand-500/10 group-hover:to-purple-500/10 transition-colors duration-500" />

                            <div className="relative z-10">
                                <div className="mb-4 p-3 bg-slate-800/50 rounded-2xl inline-block border border-white/5 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-300 font-light leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
