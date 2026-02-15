"use client";

import { ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";
import Converter from "./Converter";

export default function Hero() {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className={styles.hero} id="hero">
            <div className={`container ${styles.grid}`}>
                {/* Left — Copy */}
                <div className={styles.left}>
                    <p className={styles.eyebrow}>
                        File conversion that doesn&rsquo;t suck
                    </p>

                    <h1 className={styles.title}>
                        Stop Fighting<br />
                        <span className={styles.accent}>File Formats.</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Drop a file, pick a format, done.
                        <br />
                        No accounts, no limits, no BS.
                    </p>

                    <div className={styles.actions}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => scrollTo("dropzone")} // Point to dropzone ID inside Converter
                            id="hero-cta"
                        >
                            Start Flipping
                            <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => scrollTo("how-it-works")}
                        >
                            See How It Works
                        </button>
                    </div>

                    <div className={styles.trust}>
                        <span className={styles.trustItem}>
                            <strong>2.4M+</strong> files flipped
                        </span>
                        <span className={styles.trustItem}>
                            Auto-deletes in 30min
                        </span>
                        <span className={styles.trustItem}>
                            No signup needed
                        </span>
                    </div>
                </div>

                {/* Right — Actual Converter (embedded) */}
                <div className={styles.right}>
                    <Converter minimal={true} />
                </div>
            </div>
        </section>
    );
}
