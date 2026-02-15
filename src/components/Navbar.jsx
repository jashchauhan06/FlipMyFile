"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import styles from "./Navbar.module.css";

const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Converter", href: "#converter" },
    { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navigate = (e, href) => {
        e.preventDefault();
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    <img src="/Flipmyfile_logo.png" alt="FlipMyFile" className={styles.logoImg} />
                    <span className={styles.logoText}>FlipMyFile</span>
                </a>

                <div className={`${styles.links} ${mobileOpen ? styles.open : ""}`}>
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className={styles.link} onClick={(e) => navigate(e, l.href)}>
                            {l.label}
                        </a>
                    ))}
                    <button className={`btn btn-primary ${styles.cta}`} onClick={(e) => navigate(e, "#converter")}>
                        Flip a File
                    </button>
                </div>

                <button
                    className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    );
}
