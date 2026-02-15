"use client";

import { useState } from "react";
import styles from "./FAQ.module.css";

const faqs = [
    {
        q: "How does this actually work?",
        a: "Drop a file, pick a format, click Flip. We process it and give you a download link. That's literally it.",
    },
    {
        q: "Is it really free?",
        a: "Yep. 5 conversions a day, up to 25MB each. No credit card, no signup, no catch. Pro unlocks unlimited everything for $9/mo.",
    },
    {
        q: "What formats do you support?",
        a: "All the big ones: JPG, PNG, WebP, GIF, BMP, TIFF for images. MP4, MOV, AVI, WebM, MKV for video. We're always adding more.",
    },
    {
        q: "What happens to my files?",
        a: "We auto-delete everything after 30 minutes. Your files are processed in isolated environments with encrypted connections. We never look at, store, or share your stuff.",
    },
    {
        q: "What's the max file size?",
        a: "25MB on the free plan. Pro users get up to 500MB. If you need more than that, reach out — we have enterprise options.",
    },
    {
        q: "Do I need an account?",
        a: "Nope. Just flip and go. Accounts are optional and only needed if you want Pro features or conversion history.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section className={`section ${styles.section}`} id="faq">
            <div className="container">
                <div className="section-header-center">
                    <p className="section-label">FAQ</p>
                    <h2 className="section-title">Got questions?</h2>
                    <p className="section-subtitle">
                        Here are the ones we get asked the most.
                    </p>
                </div>

                <div className={styles.list}>
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles.item} ${openIndex === i ? styles.open : ""}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggle(i)}
                                aria-expanded={openIndex === i}
                                id={`faq-${i}`}
                            >
                                <span>{item.q}</span>
                                <span className={styles.chevron}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </button>
                            <div className={styles.answerWrap}>
                                <p className={styles.answer}>{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
