'use client';
import { useEffect, useRef } from 'react';
import styles from './ThemeTransition.module.css';

/**
 * ThemeTransitionOverlay
 * Receives `trigger` – an object { x, y, theme } set by page.js every time the user clicks the toggle.
 * It creates a full-page circular ripple that expands from the click position,
 * briefly renders the "new theme" surface colour, then disappears and lets the
 * real CSS variables (already updated) show through.
 */
export default function ThemeTransitionOverlay({ trigger }) {
    const overlayRef = useRef(null);
    const rippleRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        if (!trigger) return;

        const overlay = overlayRef.current;
        const ripple = rippleRef.current;
        if (!overlay || !ripple) return;

        // Cancel any running animation
        if (animRef.current) {
            animRef.current.cancel();
        }

        const { x, y, toTheme } = trigger;

        // The ripple colour matches the destination theme's background
        const targetBg = toTheme === 'light' ? '#f6f8fa' : '#0d1117';

        // Size large enough to cover any viewport diagonal
        const size = Math.hypot(window.innerWidth, window.innerHeight) * 2.2;

        // Position circle so it expands from the click point
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        ripple.style.background = targetBg;

        overlay.style.pointerEvents = 'all';
        overlay.style.opacity = '1';

        animRef.current = ripple.animate(
            [
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(1)', opacity: 1 },
            ],
            {
                duration: 680,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards',
            }
        );

        animRef.current.onfinish = () => {
            // Fade the overlay out so real DOM shows through
            overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 220,
                easing: 'ease-out',
                fill: 'forwards',
            }).onfinish = () => {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                ripple.style.transform = 'scale(0)';
            };
        };
    }, [trigger]);

    return (
        <div ref={overlayRef} className={styles.overlay} style={{ opacity: 0, pointerEvents: 'none' }}>
            <div ref={rippleRef} className={styles.ripple} />
        </div>
    );
}
