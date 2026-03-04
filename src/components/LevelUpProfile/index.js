'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './LevelUpProfile.module.css';
import { IconZap, IconStar, IconCheckCircle, IconArrowRight, IconTrendingUp, IconTarget } from '@/components/Icons';

import { calculateCompletion, getPowerColor } from '@/lib/profileUtils';

export default function LevelUpProfile({ profile, onActionClick }) {
    const { progress, missing, checks } = calculateCompletion(profile);
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const prevProgress = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 300);

        if (progress > prevProgress.current && prevProgress.current > 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        }
        prevProgress.current = progress;

        return () => clearTimeout(timer);
    }, [progress]);

    // Dynamic color shifting based on power level
    const powerColor = getPowerColor(progress);
    const gradient = `conic-gradient(from 180deg at 50% 50%, var(--card-bg) 0deg, ${powerColor} ${animatedProgress * 3.6}deg, rgba(255,255,255,0.05) ${animatedProgress * 3.6}deg)`;

    const message = progress === 100
        ? 'Maximum Power Reached!'
        : progress >= 70
            ? 'Almost Legendary.'
            : progress >= 40
                ? 'Gaining Momentum.'
                : 'Initialize Sequence.';

    return (
        <div className={styles.levelUpContainer}>
            {/* Ambient Glow */}
            <div className={styles.ambientGlow} style={{ backgroundColor: powerColor }}></div>

            {showConfetti && <div className={styles.confettiOverlay}>
                {[...Array(15)].map((_, i) => (
                    <span key={i} className={styles.confettiPiece} style={{
                        '--x': `${Math.random() * 100}%`,
                        '--delay': `${Math.random() * 0.5}s`,
                        '--color': ['#00bfa5', '#f0883e', '#8b5cf6', '#f85149', '#ffd700'][i % 5],
                    }}></span>
                ))}
            </div>}

            <div className={styles.header}>
                <h3 className={styles.title}>
                    <IconZap size={16} color={powerColor} className={styles.titleIcon} />
                    Profile Power
                </h3>
                {progress === 100 && <span className={styles.maxBadge}>MAX</span>}
            </div>

            <p className={styles.subtitle}>{message}</p>

            {/* Futuristic Arc Progress */}
            <div className={styles.arcWrapper}>
                <div className={styles.arcBackground}></div>
                <div className={styles.arcFill} style={{ background: gradient }}></div>
                <div className={styles.arcInner}>
                    <span className={styles.percentText}>{animatedProgress}%</span>
                    <span className={styles.powerLabel}>POWERED</span>
                </div>
            </div>

            {/* Sleek Minimalist Checklist Track */}
            {missing.length > 0 && (
                <div className={styles.trackList}>
                    {missing.map((c, index) => (
                        <div key={c.label} className={`${styles.trackNode} ${styles.nodePending}`} onClick={() => onActionClick && onActionClick(c.action)} style={{ cursor: 'pointer' }}>
                            <div className={styles.nodeLine} style={{ opacity: index === missing.length - 1 ? 0 : 1 }}></div>
                            <div className={styles.nodeIndicator}>
                                <div className={styles.nodeDot}></div>
                            </div>
                            <div className={styles.nodeContent}>
                                <span className={styles.nodeLabel}>{c.label}</span>
                                <span className={styles.nodeWeight}>+{c.weight}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Next Action Hologram Box */}
            {missing.length > 0 && (
                <div className={styles.hologramAction} onClick={() => onActionClick && onActionClick(missing[0].action)}>
                    <div className={styles.holoScanline}></div>
                    <div className={styles.holoContent}>
                        <div className={styles.holoHeader}>
                            <span className={styles.holoLabel}>NEXT OBJECTIVE</span>
                            <span className={styles.holoBonus}>+{missing[0].weight}%</span>
                        </div>
                        <h4 className={styles.holoTitle}>{missing[0].label}</h4>
                        <p className={styles.holoDesc}>Complete this module to upgrade visibility.</p>
                    </div>
                    <div className={styles.holoArrow}>
                        <IconArrowRight size={18} />
                    </div>
                </div>
            )}
        </div>
    );
}

