"use client";

import { Check, Heart, Coffee } from "lucide-react";
import styles from "./Pricing.module.css";

export default function Pricing() {
    return (
        <section className={`section ${styles.section}`} id="pricing">
            <div className="container">
                <div className="section-header-center">
                    <p className="section-label">Support</p>
                    <h2 className="section-title">Free. Forever.</h2>
                    <p className="section-subtitle">
                        We don&rsquo;t do accounts, subscriptions, or data selling.
                        <br />
                        If this tool saved you time, consider buying us a coffee.
                    </p>
                </div>

                <div className={styles.grid}>
                    {/* Free Card */}
                    <div className={styles.card}>
                        <h3 className={styles.planName}>The Flipper</h3>
                        <div className={styles.price}>
                            $0
                            <span className={styles.period}>/forever</span>
                        </div>
                        <p className={styles.description}>
                            Everything you need. No hidden caps.
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>Unlimited conversions</span>
                            </div>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>100MB max file size</span>
                            </div>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>No account needed</span>
                            </div>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>Files auto-deleted</span>
                            </div>
                        </div>

                        <div className={styles.spacer} />

                        <button className="btn btn-secondary" style={{ width: "100%" }}>
                            Start Flipping
                        </button>
                    </div>

                    {/* Support Card */}
                    <div className={`${styles.card} ${styles.popular}`}>
                        <div className={styles.badge}>Good Karma</div>
                        <h3 className={styles.planName}>The Supporter</h3>
                        <div className={styles.price}>
                            $5
                            <span className={styles.period}>/one-time</span>
                        </div>
                        <p className={styles.description}>
                            Keep the servers running and the devs caffeinated.
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <Heart className={styles.checkIcon} size={18} fill="currentColor" />
                                <span>Eternal gratitude</span>
                            </div>
                            <div className={styles.feature}>
                                <Coffee className={styles.checkIcon} size={18} />
                                <span>Fuel future updates</span>
                            </div>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>Support indie software</span>
                            </div>
                            <div className={styles.feature}>
                                <Check className={styles.checkIcon} size={18} />
                                <span>Priority feature requests</span>
                            </div>
                        </div>

                        <div className={styles.spacer} />

                        <button className="btn btn-primary" style={{ width: "100%" }}>
                            Buy us a Coffee ☕
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
