'use client';
import styles from './Navbar.module.css';
import { IconSun, IconMoon, IconChevronDown } from '@/components/Icons';

export default function Navbar({ profileName, avatarUrl, theme, toggleTheme }) {
    const gidyLogo = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.logoSvg}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="currentColor" />
        </svg>
    );

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
                    <button onClick={toggleTheme} className={styles.themeToggle} title="Toggle Theme">
                        {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
                    </button>
                    <div className={styles.avatarContainer}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile Avatar" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <span className={styles.arrowDrop}><IconChevronDown size={14} /></span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
