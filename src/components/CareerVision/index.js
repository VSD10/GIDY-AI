'use client';
import styles from './CareerVision.module.css';
import { IconEdit, IconSparkles } from '@/components/Icons';

export default function CareerVision({ profile, onEdit }) {
    if (!profile) return null;

    return (
        <div className={`card ${styles.visionCard}`}>
            <button className={`edit-btn ${styles.editCornerBtn}`} onClick={onEdit} title="Edit Career Vision">
                <IconEdit size={16} />
            </button>

            <div className={styles.headerRow}>
                <div className={styles.titleSection}>
                    <span className={styles.subLabel}>You're Career Vision</span>
                    <h2 className={styles.title}>{profile.careerVision || 'Add your career vision'}</h2>
                </div>
                <div className={styles.iconBadge}><IconSparkles size={22} color="#f0883e" /></div>
            </div>

            <div className={styles.visionGrid}>
                <div className={styles.visionCol}>
                    <span className={styles.colLabel}>What you're growing into right now</span>
                    <span className={styles.colValue}>{profile.currentRole || 'Not specified'}</span>
                </div>

                <div className={styles.visionCol}>
                    <span className={styles.colLabel}>The space you want to grow in</span>
                    <span className={styles.colValue}>{profile.growthSpace || 'Not specified'}</span>
                </div>

                <div className={styles.visionCol}>
                    <span className={styles.colLabel}>Inspired by</span>
                    <span className={styles.colValue}>{profile.inspiredBy || 'Not specified'}</span>
                </div>
            </div>
        </div>
    );
}
