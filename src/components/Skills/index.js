'use client';
import { useState, useEffect } from 'react';
import styles from './Skills.module.css';
import { IconPlusCircle, IconThumbsUp } from '@/components/Icons';

export default function Skills({ skills, onEdit, isPublicView }) {
    const [endorsingId, setEndorsingId] = useState(null);
    const [localSkills, setLocalSkills] = useState(skills || []);

    // Sync with parent when skills prop updates (e.g. after editing)
    useEffect(() => {
        setLocalSkills(skills || []);
    }, [skills]);

    const handleEndorse = async (skillId) => {
        try {
            setEndorsingId(skillId);

            const res = await fetch('/api/endorsements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId })
            });

            if (!res.ok) throw new Error('Failed to endorse');

            const data = await res.json();

            // Update local state to reflect new count immediately
            setLocalSkills(prev =>
                prev.map(s =>
                    s.id === skillId ? { ...s, endorsements: data.currentCount } : s
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setEndorsingId(null), 500);
        }
    };

    return (
        <div className={`card ${styles.skillsCard}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Skills</h3>
                {!isPublicView && (
                    <button className={styles.addBtn} onClick={onEdit} title="Add Skills">
                        <IconPlusCircle size={18} />
                    </button>
                )}
            </div>

            <div className={styles.skillsGrid}>
                {localSkills.map((skill) => (
                    <div key={skill.id} className={styles.skillChip}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <button
                            className={`${styles.endorseBtn} ${endorsingId === skill.id ? styles.endorsing : ''} ${skill.endorsements > 0 ? styles.hasEndorsements : ''}`}
                            onClick={() => handleEndorse(skill.id)}
                            title="Endorse this skill"
                        >
                            <span className={styles.plusIcon}><IconThumbsUp size={12} /></span>
                            {skill.endorsements > 0 && (
                                <span className={styles.endorseCount}>{skill.endorsements}</span>
                            )}
                        </button>
                    </div>
                ))}
                {localSkills.length === 0 && (
                    <p className="text-muted text-sm">No skills added yet.</p>
                )}
            </div>
        </div>
    );
}
