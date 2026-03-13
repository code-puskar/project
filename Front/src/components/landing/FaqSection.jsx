import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        q: "Who can submit a road issue?",
        a: "Anyone with a phone or desktop browser. Anonymous reports are allowed, but verified accounts speed up routing and approvals.",
    },
    {
        q: "How are reports prioritized?",
        a: "AI triage plus community validation score each report by severity, location risk, and duplicate detection before dispatching to the right crew.",
    },
    {
        q: "Can residents track resolution status?",
        a: "Yes. Every submission shows timestamps for triage, assignment, field updates, and closure, with optional photo proof at completion.",
    },
    {
        q: "Do you integrate with existing city CRMs?",
        a: "We provide REST and webhook integrations for leading work-order systems so teams keep their current workflows.",
    },
];

function AccordionItem({ item, index, isOpen, onToggle }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/15">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left text-white"
            >
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold tracking-[0.16em] text-blue-200/60">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm md:text-base font-semibold">{item.q}</span>
                </div>
                <svg
                    className={`w-4 h-4 text-blue-200 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
                <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-blue-200/60 text-sm leading-relaxed">{item.a}</p>
                </div>
            </div>
        </div>
    );
}

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-3"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                        FAQ
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">Answers for first-time users</h2>
                    <p className="text-blue-200/60 max-w-2xl mx-auto font-light">
                        Quick guidance on using the system and reporting issues effectively.
                    </p>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((item, index) => (
                        <AccordionItem
                            key={item.q}
                            item={item}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
