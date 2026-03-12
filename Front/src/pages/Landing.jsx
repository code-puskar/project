// src/pages/Landing.jsx
import React from "react";
import Hero from "../components/landing/Hero";
import FeaturesBento from "../components/landing/FeaturesBento";
import ScrollStory from "../components/landing/ScrollStory";
import StatsBar from "../components/landing/StatsBar";
import Footer from "../components/landing/Footer";
import LightPillar from "../components/landing/LightPillar";

export default function Landing({ onOpenLogin, onOpenRegister }) {
    return (
        <div className="bg-[#060918] text-white min-h-screen font-sans antialiased selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* Fixed LightPillar background — stays behind all content */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            >
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <LightPillar
                        topColor="#2d00e0"
                        bottomColor="#9cadb0"
                        intensity={0.8}
                        rotationSpeed={0.3}
                        glowAmount={0.003}
                        pillarWidth={3.9}
                        pillarHeight={0.4}
                        noiseIntensity={0.5}
                        pillarRotation={25}
                        interactive
                        mixBlendMode="screen"
                        quality="high"
                    />
                </div>
            </div>

            {/* Page content — sits above the LightPillar */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <Hero onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />
                <StatsBar />
                <FeaturesBento />
                <ScrollStory />
                <Footer />
            </div>
        </div>
    );
}
