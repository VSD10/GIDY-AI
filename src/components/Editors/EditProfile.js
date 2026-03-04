'use client';
import { useState, useRef } from 'react';
import EditModal from '@/components/EditModal';
import styles from './EditProfile.module.css';
import { IconCamera, IconSparkles, IconCheck, IconLink, IconGithub, IconLinkedin, IconGlobe, IconDownload, IconX } from '@/components/Icons';

const PLATFORM_OPTIONS = [
    { value: 'github', label: 'GitHub', icon: <IconGithub size={14} />, placeholder: 'https://github.com/username' },
    { value: 'linkedin', label: 'LinkedIn', icon: <IconLinkedin size={14} />, placeholder: 'https://linkedin.com/in/username' },
    { value: 'portfolio', label: 'Portfolio', icon: <IconGlobe size={14} />, placeholder: 'https://yoursite.com' },
    { value: 'twitter', label: 'Twitter / X', icon: <IconLink size={14} />, placeholder: 'https://x.com/username' },
    { value: 'website', label: 'Website', icon: <IconLink size={14} />, placeholder: 'https://example.com' },
];

export default function EditProfile({ profile, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        tag: profile?.tag || '',
        bio: profile?.bio || '',
        email: profile?.email || '',
        location: profile?.location || '',
        avatarUrl: profile?.avatarUrl || '',
        bannerUrl: profile?.bannerUrl || '',
        resumeUrl: profile?.resumeUrl || '',
    });
    const [socialLinks, setSocialLinks] = useState(profile?.socialLinks || []);
    const [showAddLink, setShowAddLink] = useState(false);
    const [newLink, setNewLink] = useState({ platform: 'github', url: '' });
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || '');
    const [bannerPreview, setBannerPreview] = useState(profile?.bannerUrl || '');
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'avatar') {
                setAvatarPreview(reader.result);
                setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
            } else if (type === 'banner') {
                setBannerPreview(reader.result);
                setFormData(prev => ({ ...prev, bannerUrl: reader.result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, resumeUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateBio = async () => {
        try {
            setIsGeneratingBio(true);
            const res = await fetch('/api/generate-bio', { method: 'POST' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate bio');
            }
            const data = await res.json();
            setFormData(prev => ({ ...prev, bio: data.bio }));
        } catch (err) {
            console.error(err);
            alert(`AI Generation Error: ${err.message}`);
        }
        finally { setIsGeneratingBio(false); }
    };

    const handleAddSocialLink = async () => {
        if (!newLink.url.trim()) return;
        try {
            const res = await fetch('/api/social-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLink),
            });
            if (!res.ok) throw new Error('Failed');
            const link = await res.json();
            setSocialLinks(prev => [...prev, link]);
            setNewLink({ platform: 'github', url: '' });
            setShowAddLink(false);
        } catch (err) { console.error(err); }
    };

    const handleRemoveSocialLink = async (id) => {
        try {
            const res = await fetch(`/api/social-links/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setSocialLinks(prev => prev.filter(l => l.id !== id));
        } catch (err) { console.error(err); }
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
            onSave({ ...updated, socialLinks });
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const getPlatformDisplay = (platform) => {
        const opt = PLATFORM_OPTIONS.find(p => p.value === platform);
        return opt ? <>{opt.icon} {opt.label}</> : <><IconLink size={14} /> {platform}</>;
    };

    return (
        <EditModal title="Edit Profile" onClose={onClose} wide>
            {/* ===== SECTION 1: BANNER & AVATAR ===== */}
            <div className={styles.mediaSection}>
                <label className={styles.sectionTitle}>Profile Media</label>

                {/* Banner Upload */}
                <div className={styles.bannerUpload} onClick={() => bannerInputRef.current?.click()}>
                    {bannerPreview ? (
                        <img src={bannerPreview} alt="Banner" className={styles.bannerPreviewImg} />
                    ) : (
                        <div className={styles.bannerPlaceholder}>
                            <IconCamera size={22} />
                            <span>Upload Cover Banner</span>
                            <span className={styles.hint}>Recommended: 1400 × 400px</span>
                        </div>
                    )}
                    {bannerPreview && (
                        <div className={styles.bannerOverlay}>
                            <IconCamera size={18} color="white" />
                            <span>Change Cover</span>
                        </div>
                    )}
                    <input ref={bannerInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className={styles.hiddenInput} />
                </div>

                {/* Avatar Upload — overlapping banner bottom */}
                <div className={styles.avatarUploadRow}>
                    <div className={styles.avatarUpload} onClick={() => avatarInputRef.current?.click()}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className={styles.avatarBadge}><IconCamera size={12} color="white" /></div>
                        <input ref={avatarInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} className={styles.hiddenInput} />
                    </div>
                    <span className={styles.avatarHint}>Click to change profile photo</span>
                </div>
            </div>

            {/* ===== SECTION 2: PERSONAL INFO ===== */}
            <div className={styles.section}>
                <label className={styles.sectionTitle}>Personal Information</label>
                <div className={styles.fieldGrid}>
                    <div className={styles.field}>
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                    </div>
                    <div className={styles.field}>
                        <label>Tag / Title</label>
                        <input type="text" name="tag" value={formData.tag} onChange={handleChange} placeholder="e.g. Final-Year Student" />
                    </div>
                    <div className={styles.field}>
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City or Region" />
                    </div>
                    <div className={styles.field}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                    </div>
                </div>
            </div>

            {/* ===== SECTION 3: BIO ===== */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.sectionTitle}>Bio</label>
                    <button type="button" className={styles.aiBtn} onClick={handleGenerateBio} disabled={isGeneratingBio}>
                        {isGeneratingBio ? <><IconSparkles size={13} /> Generating...</> : <><IconSparkles size={13} /> AI Generate</>}
                    </button>
                </div>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="A short summary about yourself..."
                    className={isGeneratingBio ? styles.pulseArea : ''}
                />
            </div>

            {/* ===== SECTION 4: RESUME ===== */}
            <div className={styles.section}>
                <label className={styles.sectionTitle}>Resume</label>
                <div className={styles.resumeUpload} onClick={() => resumeInputRef.current?.click()}>
                    <div className={styles.resumeIcon}><IconDownload size={20} /></div>
                    <div className={styles.resumeText}>
                        {formData.resumeUrl ? (
                            <>
                                <span className={styles.resumeUploaded}>Resume uploaded</span>
                                <span className={styles.hint}>Click to replace</span>
                            </>
                        ) : (
                            <>
                                <span>Upload your resume</span>
                                <span className={styles.hint}>PDF, DOC, or DOCX — Max 5MB</span>
                            </>
                        )}
                    </div>
                    <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className={styles.hiddenInput} />
                </div>
            </div>

            {/* ===== SECTION 5: SOCIAL LINKS ===== */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.sectionTitle}>Social Links</label>
                    <button type="button" className={styles.addLinkBtn} onClick={() => setShowAddLink(!showAddLink)}>
                        {showAddLink ? <><IconX size={12} /> Cancel</> : '+ Add Link'}
                    </button>
                </div>

                <div className={styles.linkList}>
                    {socialLinks.map(link => (
                        <div key={link.id} className={styles.linkItem}>
                            <span className={styles.linkPlatform}>{getPlatformDisplay(link.platform)}</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>{link.url}</a>
                            <button className={styles.linkRemoveBtn} onClick={() => handleRemoveSocialLink(link.id)}>
                                <IconX size={13} />
                            </button>
                        </div>
                    ))}
                    {socialLinks.length === 0 && !showAddLink && (
                        <p className={styles.noLinks}>No social links yet. Add your GitHub, LinkedIn, or portfolio!</p>
                    )}
                </div>

                {showAddLink && (
                    <div className={styles.addLinkForm}>
                        <select
                            value={newLink.platform}
                            onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                            className={styles.platformSelect}
                        >
                            {PLATFORM_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input
                            type="url"
                            value={newLink.url}
                            onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                            placeholder={PLATFORM_OPTIONS.find(p => p.value === newLink.platform)?.placeholder || 'https://...'}
                            className={styles.linkInput}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSocialLink()}
                        />
                        <button className={styles.addLinkSaveBtn} onClick={handleAddSocialLink} disabled={!newLink.url.trim()}>Add</button>
                    </div>
                )}
            </div>

            {/* ===== FOOTER ===== */}
            <div className={styles.footer}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : <><IconCheck size={14} /> Save Changes</>}
                </button>
            </div>
        </EditModal>
    );
}
