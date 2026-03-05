'use client';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ profileName, avatarUrl, theme, toggleTheme, username }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const handleToggle = (e) => {
        if (isAnimating) return;
        setIsAnimating(true);
        toggleTheme(e);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const handleShare = () => {
        if (!username) return;
        const url = `${window.location.origin}/u/${username}`;
        navigator.clipboard.writeText(url).then(() => {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
        });
    };

    const isDark = theme === 'dark';

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.leftSection}>
                    <img src="/image.png" alt="Gidy Logo" style={{ height: '30px', width: 'auto' }} />
                    <ul className={styles.navLinks}>
                        <li><a href="#" className={styles.active}>Jobs</a></li>
                        <li><a href="#">Hackathons</a></li>
                        <li><a href="#">Projects</a></li>
                        <li><a href="#">Tasks</a></li>
                        <li><a href="#">Organization</a></li>
                    </ul>
                </div>

                <div className={styles.rightSection}>

                    {/* Share Profile Button */}
                    {username && (
                        <button onClick={handleShare} className={`${styles.shareProfileBtn} ${shareCopied ? styles.copied : ''}`} title={`/u/${username}`}>
                            {shareCopied ? (
                                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12" /></svg> Copied!</>
                            ) : (
                                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg> Share</>
                            )}
                        </button>
                    )}
                    <button
                        onClick={handleToggle}
                        className={`${styles.themeToggle} ${isDark ? styles.dark : styles.light} ${isAnimating ? styles.animating : ''}`}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        aria-label="Toggle theme"
                    >
                        {/* Track */}
                        <span className={styles.track}>
                            {/* Stars (dark side) */}
                            <span className={styles.stars}>
                                <span className={styles.star} style={{ top: '30%', left: '18%', '--size': '2px' }} />
                                <span className={styles.star} style={{ top: '55%', left: '30%', '--size': '1.5px' }} />
                                <span className={styles.star} style={{ top: '25%', left: '40%', '--size': '2.5px' }} />
                            </span>

                            {/* Clouds (light side) */}
                            <span className={styles.clouds}>
                                <span className={styles.cloud} style={{ bottom: '22%', right: '22%', '--w': '14px' }} />
                                <span className={styles.cloud} style={{ bottom: '40%', right: '36%', '--w': '10px' }} />
                            </span>

                            {/* Thumb with icon */}
                            <span className={styles.thumb}>
                                <span className={styles.thumbIcon}>
                                    {isDark ? (
                                        /* Moon */
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                    ) : (
                                        /* Sun */
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </span>
                            </span>
                        </span>

                        {/* Label */}
                        <span className={styles.label}>{isDark ? 'Dark' : 'Light'}</span>
                    </button>

                    <div className={styles.avatarContainer}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile Avatar" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <span className={styles.arrowDrop}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
