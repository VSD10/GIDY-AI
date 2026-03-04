'use client';
import { useState } from 'react';
import EditModal from '@/components/EditModal';
import styles from './EditCareerVision.module.css';
import { IconCheck } from '@/components/Icons';

export default function EditCareerVision({ profile, onClose, onSave }) {
    const [formData, setFormData] = useState({
        careerVision: profile?.careerVision || '',
        currentRole: profile?.currentRole || '',
        growthSpace: profile?.growthSpace || '',
        inspiredBy: profile?.inspiredBy || '',
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...profile, ...formData }),
            });
            if (!res.ok) throw new Error('Failed');
            const updated = await res.json();
            onSave(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const visionPresets = ['Technical Founder', 'Engineering Manager', 'CTO', 'Product Lead', 'Full-Stack Architect', 'AI/ML Engineer'];
    const spacePresets = ['Artificial Intelligence (AI)', 'Web Development', 'Cloud Computing', 'Blockchain', 'Cybersecurity', 'Data Science'];

    return (
        <EditModal title="Edit Career Vision" onClose={onClose}>
            <div className={styles.section}>
                <label className={styles.label}>Your Ultimate Career Vision</label>
                <input type="text" name="careerVision" value={formData.careerVision} onChange={handleChange} placeholder="e.g. Technical Founder" />
                <div className={styles.quickPicks}>
                    {visionPresets.map(v => (
                        <button key={v} type="button" className={`${styles.chip} ${formData.careerVision === v ? styles.activeChip : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, careerVision: v }))}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>What you're growing into right now</label>
                <input type="text" name="currentRole" value={formData.currentRole} onChange={handleChange} placeholder="e.g. Entry Level Professional" />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>The space you want to grow in</label>
                <input type="text" name="growthSpace" value={formData.growthSpace} onChange={handleChange} placeholder="e.g. Artificial Intelligence" />
                <div className={styles.quickPicks}>
                    {spacePresets.map(s => (
                        <button key={s} type="button" className={`${styles.chip} ${formData.growthSpace === s ? styles.activeChip : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, growthSpace: s }))}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Inspired by</label>
                <input type="text" name="inspiredBy" value={formData.inspiredBy} onChange={handleChange} placeholder="e.g. Elon Musk" />
            </div>

            <div className={styles.footer}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : <><IconCheck size={14} /> Save Vision</>}
                </button>
            </div>
        </EditModal>
    );
}
