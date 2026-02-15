"use client";

import { Zap } from "lucide-react";
import styles from "./Footer.module.css";

const productLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Converter", href: "#converter" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
];

export default function Footer() {
    const scrollTo = (e, href) => {
        e.preventDefault();
        if (href === "#") return;
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className={styles.footer} id="footer">
            <div className={`container ${styles.inner}`}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                            <Zap className={styles.logoIcon} />
                            <span className={styles.logoText}>FlipMyFile</span>
                        </a>
                        <p className={styles.tagline}>
                            Built for people who just want their files to work.
                        </p>
                    </div>

                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Product</h4>
                        {productLinks.map((l) => (
                            <a key={l.label} href={l.href} className={styles.link} onClick={(e) => scrollTo(e, l.href)}>
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Legal</h4>
                        {legalLinks.map((l) => (
                            <a key={l.label} href={l.href} className={styles.link}>
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} FlipMyFile
                    </p>
                </div>
            </div>
        </footer>
    );
}
