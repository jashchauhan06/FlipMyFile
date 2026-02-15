"use client";

import styles from "./Features.module.css";

const steps = [
    {
        num: "01",
        title: "Drop It",
        desc: "Drag your file in or click to browse. Images, videos — we handle it.",
    },
    {
        num: "02",
        title: "Pick It",
        desc: "Choose from 20+ output formats. JPG, PNG, WebP, MP4, you name it.",
    },
    {
        num: "03",
        title: "Flip It",
        desc: "Hit convert and download instantly. Your file, your way.",
    },
];

export default function Features() {
    return (
        <section className={`section ${styles.section}`} id="how-it-works">
            <div className="container">
                <div className="section-header-center">
                    <p className="section-label">How It Works</p>
                    <h2 className="section-title">Three steps. That&rsquo;s it.</h2>
                    <p className="section-subtitle">
                        No tutorials needed. If you can drag a file, you can use FlipMyFile.
                    </p>
                </div>

                <div className={styles.steps}>
                    {steps.map((s, i) => (
                        <div key={s.num} className={styles.step}>
                            <span className={styles.stepNum}>{s.num}</span>
                            <h3 className={styles.stepTitle}>{s.title}</h3>
                            <p className={styles.stepDesc}>{s.desc}</p>
                            {i < steps.length - 1 && (
                                <div className={styles.arrow}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
