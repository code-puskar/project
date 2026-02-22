import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, Suspense } from "react";
import { motion } from "framer-motion";

const StarParticles = (props) => {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">

            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <StarParticles />
                    </Suspense>
                </Canvas>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium tracking-wide"
                    >
                        Introducing SmartCity Beta 2.0
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                        Empowering Citizens. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
                            Building Smarter Cities.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Report hazards, track infrastructure issues, and collaborate with your community to improve urban living through our cutting-edge 3D interactive platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="#dashboard" // Will transition to the dashboard state
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
                        >
                            Enter the Hub
                        </motion.a>
                        <motion.a
                            href="#how-it-works"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-lg transition-all backdrop-blur-sm"
                        >
                            See How It Works
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative gradient blur at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
