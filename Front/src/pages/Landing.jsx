// src/pages/Landing.jsx
import React from "react";
import Hero from "../components/landing/Hero";
import FeaturesBento from "../components/landing/FeaturesBento";
import ScrollStory from "../components/landing/ScrollStory";
import StatsBar from "../components/landing/StatsBar";
import Footer from "../components/landing/Footer";

export default function Landing({ onOpenLogin, onOpenRegister }) {
    return (
        <div className="bg-[#060918] text-white min-h-screen font-sans antialiased selection:bg-blue-500/30 overflow-x-hidden">
            <Hero onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />
            <StatsBar />
            <FeaturesBento />
            <ScrollStory />
            <Footer />
        </div>
    );
}
