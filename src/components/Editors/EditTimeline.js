'use client';
import { useState } from 'react';
import EditModal from '@/components/EditModal';
import styles from './EditTimeline.module.css';
import { IconBriefcase, IconGraduationCap, IconAward, IconTrash, IconCheck } from '@/components/Icons';

export function EditExperience({ experiences, onClose, onSave }) {
    const [items, setItems] = useState(experiences || []);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', company: '', location: '', startDate: '', endDate: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        if (!formData.title || !formData.company || !formData.startDate) return;
        setSaving(true);
        try {
            const res = await fetch('/api/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed');
            const item = await res.json();
            setItems(prev => [...prev, item]);
            setFormData({ title: '', company: '', location: '', startDate: '', endDate: '' });
            setShowForm(false);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setItems(prev => prev.filter(x => x.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <EditModal title="Edit Experience" onClose={() => { onSave(items); onClose(); }}>
            {/* Existing Items */}
            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemIcon}><IconBriefcase size={18} color="var(--accent-color)" /></div>
                        <div className={styles.itemDetails}>
                            <strong>{item.title}</strong>
                            <span className={styles.sub}>{item.company}{item.location ? `, ${item.location}` : ''}</span>
                            <span className={styles.dates}>{item.startDate} — {item.endDate || 'Present'}</span>
                        </div>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete"><IconTrash size={15} /></button>
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}>No experience added yet.</div>}
            </div>

            {/* Add New */}
            {!showForm ? (
                <button className={styles.addNewBtn} onClick={() => setShowForm(true)}>
                    + Add Experience
                </button>
            ) : (
                <div className={styles.formCard}>
                    <h4 className={styles.formTitle}>New Experience</h4>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Job Title *</label>
                            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer" />
                        </div>
                        <div className={styles.field}>
                            <label>Company *</label>
                            <input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" />
                        </div>
                        <div className={styles.field}>
                            <label>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore" />
                        </div>
                        <div className={styles.field}>
                            <label>Start Date *</label>
                            <input name="startDate" value={formData.startDate} onChange={handleChange} placeholder="e.g. Jan 2024" />
                        </div>
                        <div className={styles.field}>
                            <label>End Date</label>
                            <input name="endDate" value={formData.endDate} onChange={handleChange} placeholder="e.g. Present" />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.cancelSmBtn} onClick={() => setShowForm(false)}>Cancel</button>
                        <button className={styles.savSmBtn} onClick={handleAdd} disabled={saving}>
                            {saving ? 'Adding...' : '+ Add'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.footer}>
                <button className={styles.doneBtn} onClick={() => { onSave(items); onClose(); }}><IconCheck size={14} /> Done</button>
            </div>
        </EditModal>
    );
}

export function EditEducation({ educations, onClose, onSave }) {
    const [items, setItems] = useState(educations || []);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ degree: '', institution: '', location: '', startDate: '', endDate: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        if (!formData.degree || !formData.institution || !formData.startDate) return;
        setSaving(true);
        try {
            const res = await fetch('/api/education', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed');
            const item = await res.json();
            setItems(prev => [...prev, item]);
            setFormData({ degree: '', institution: '', location: '', startDate: '', endDate: '' });
            setShowForm(false);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setItems(prev => prev.filter(x => x.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <EditModal title="Edit Education" onClose={() => { onSave(items); onClose(); }}>
            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemIcon}><IconGraduationCap size={18} color="var(--accent-color)" /></div>
                        <div className={styles.itemDetails}>
                            <strong>{item.degree}</strong>
                            <span className={styles.sub}>{item.institution}{item.location ? `, ${item.location}` : ''}</span>
                            <span className={styles.dates}>{item.startDate} — {item.endDate || 'Present'}</span>
                        </div>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete"><IconTrash size={15} /></button>
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}>No education added yet.</div>}
            </div>

            {!showForm ? (
                <button className={styles.addNewBtn} onClick={() => setShowForm(true)}>
                    + Add Education
                </button>
            ) : (
                <div className={styles.formCard}>
                    <h4 className={styles.formTitle}>New Education</h4>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Degree *</label>
                            <input name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
                        </div>
                        <div className={styles.field}>
                            <label>Institution *</label>
                            <input name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. MIT" />
                        </div>
                        <div className={styles.field}>
                            <label>Location</label>
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Salem" />
                        </div>
                        <div className={styles.field}>
                            <label>Start Date *</label>
                            <input name="startDate" value={formData.startDate} onChange={handleChange} placeholder="e.g. Nov 2022" />
                        </div>
                        <div className={styles.field}>
                            <label>End Date</label>
                            <input name="endDate" value={formData.endDate} onChange={handleChange} placeholder="e.g. Present" />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.cancelSmBtn} onClick={() => setShowForm(false)}>Cancel</button>
                        <button className={styles.savSmBtn} onClick={handleAdd} disabled={saving}>
                            {saving ? 'Adding...' : '+ Add'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.footer}>
                <button className={styles.doneBtn} onClick={() => { onSave(items); onClose(); }}><IconCheck size={14} /> Done</button>
            </div>
        </EditModal>
    );
}

export function EditCertification({ certifications, onClose, onSave }) {
    const [items, setItems] = useState(certifications || []);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', issuer: '', date: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        if (!formData.name) return;
        setSaving(true);
        try {
            const res = await fetch('/api/certifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed');
            const item = await res.json();
            setItems(prev => [...prev, item]);
            setFormData({ name: '', issuer: '', date: '' });
            setShowForm(false);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setItems(prev => prev.filter(x => x.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <EditModal title="Edit Certifications" onClose={() => { onSave(items); onClose(); }}>
            <div className={styles.itemList}>
                {items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemIcon}><IconAward size={18} color="var(--accent-color)" /></div>
                        <div className={styles.itemDetails}>
                            <strong>{item.name}</strong>
                            {item.issuer && <span className={styles.sub}>{item.issuer}</span>}
                            {item.date && <span className={styles.dates}>Issued: {item.date}</span>}
                        </div>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete"><IconTrash size={15} /></button>
                    </div>
                ))}
                {items.length === 0 && <div className={styles.empty}>No certifications added yet.</div>}
            </div>

            {!showForm ? (
                <button className={styles.addNewBtn} onClick={() => setShowForm(true)}>
                    + Add Certification
                </button>
            ) : (
                <div className={styles.formCard}>
                    <h4 className={styles.formTitle}>New Certification</h4>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Certificate Name *</label>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. AWS Cloud Practitioner" />
                        </div>
                        <div className={styles.field}>
                            <label>Issuer</label>
                            <input name="issuer" value={formData.issuer} onChange={handleChange} placeholder="e.g. Amazon Web Services" />
                        </div>
                        <div className={styles.field}>
                            <label>Date</label>
                            <input name="date" value={formData.date} onChange={handleChange} placeholder="e.g. Mar 2024" />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.cancelSmBtn} onClick={() => setShowForm(false)}>Cancel</button>
                        <button className={styles.savSmBtn} onClick={handleAdd} disabled={saving}>
                            {saving ? 'Adding...' : '+ Add'}
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.footer}>
                <button className={styles.doneBtn} onClick={() => { onSave(items); onClose(); }}><IconCheck size={14} /> Done</button>
            </div>
        </EditModal>
    );
}
