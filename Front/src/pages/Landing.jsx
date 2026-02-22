import React from "react";
import Hero from "../components/landing/Hero";
import FeaturesBento from "../components/landing/FeaturesBento";
import ScrollStory from "../components/landing/ScrollStory";
import StatsBar from "../components/landing/StatsBar";
import Footer from "../components/landing/Footer";

export default function Landing() {
    return (
        <div className="bg-slate-900 text-white min-h-screen overflow-x-hidden w-full font-sans antialiased selection:bg-brand-500/30">
            <Hero />
            <StatsBar />
            <FeaturesBento />
            <ScrollStory />
            <Footer />
        </div>
    );
}
