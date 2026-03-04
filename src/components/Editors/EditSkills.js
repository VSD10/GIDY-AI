'use client';
import { useState } from 'react';
import EditModal from '@/components/EditModal';
import styles from './EditSkills.module.css';
import { IconCheck } from '@/components/Icons';

export default function EditSkills({ skills, onClose, onSave }) {
    const [localSkills, setLocalSkills] = useState(skills || []);
    const [newSkillName, setNewSkillName] = useState('');
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(null);

    const popularSkills = ['TypeScript', 'Next.js', 'Docker', 'GraphQL', 'FastAPI', 'AWS', 'Git', 'Linux', 'TensorFlow', 'PostgreSQL', 'Redis', 'Kubernetes'];

    const existingNames = localSkills.map(s => s.name.toLowerCase());

    const addSkill = async (name) => {
        if (!name.trim() || existingNames.includes(name.trim().toLowerCase())) return;
        setSaving(true);
        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() }),
            });
            if (!res.ok) throw new Error('Failed');
            const skill = await res.json();
            setLocalSkills(prev => [...prev, skill]);
            setNewSkillName('');
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const removeSkill = async (id) => {
        setRemoving(id);
        try {
            const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setLocalSkills(prev => prev.filter(s => s.id !== id));
        } catch (err) { console.error(err); }
        finally { setRemoving(null); }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(newSkillName);
        }
    };

    return (
        <EditModal title="Edit Skills" onClose={() => { onSave(localSkills); onClose(); }}>
            {/* Current Skills */}
            <div className={styles.currentSection}>
                <label className={styles.sectionLabel}>Your Skills</label>
                <div className={styles.chipGrid}>
                    {localSkills.map(s => (
                        <div key={s.id} className={`${styles.skillChip} ${removing === s.id ? styles.removing : ''}`}>
                            <span>{s.name}</span>
                            <button className={styles.removeBtn} onClick={() => removeSkill(s.id)} title="Remove">×</button>
                        </div>
                    ))}
                    {localSkills.length === 0 && <span className={styles.empty}>No skills yet. Add some below!</span>}
                </div>
            </div>

            {/* Add New Skill */}
            <div className={styles.addSection}>
                <label className={styles.sectionLabel}>Add a Skill</label>
                <div className={styles.addRow}>
                    <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a skill name and press Enter"
                        className={styles.addInput}
                    />
                    <button
                        className={styles.addBtn}
                        onClick={() => addSkill(newSkillName)}
                        disabled={!newSkillName.trim() || saving}
                    >
                        {saving ? '...' : '+ Add'}
                    </button>
                </div>
            </div>

            {/* Quick Add Popular */}
            <div className={styles.suggestSection}>
                <label className={styles.sectionLabel}>Popular Skills</label>
                <div className={styles.chipGrid}>
                    {popularSkills.filter(s => !existingNames.includes(s.toLowerCase())).map(s => (
                        <button key={s} className={styles.suggestChip} onClick={() => addSkill(s)}>
                            + {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.doneBtn} onClick={() => { onSave(localSkills); onClose(); }}>
                    <IconCheck size={14} /> Done
                </button>
            </div>
        </EditModal>
    );
}
