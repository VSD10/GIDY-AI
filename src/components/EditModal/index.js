'use client';
import styles from './EditModal.module.css';

export default function EditModal({ title, children, onClose, wide }) {
    return (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`${styles.modalContent} ${wide ? styles.modalWide : ''}`}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.formContainer}>
                    {children}
                </div>
            </div>
        </div>
    );
}
