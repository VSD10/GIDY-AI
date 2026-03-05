'use client';
import { useState, useRef } from 'react';
import EditModal from '@/components/EditModal';
import styles from './EditProfile.module.css';
import { IconCamera, IconSparkles, IconCheck, IconLink, IconGithub, IconLinkedin, IconGlobe, IconDownload, IconX, IconTrash, IconCheckCircle } from '@/components/Icons';

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
        username: profile?.username || '',
    });
    const [socialLinks, setSocialLinks] = useState(profile?.socialLinks || []);
    const [showAddLink, setShowAddLink] = useState(false);
    const [newLink, setNewLink] = useState({ platform: 'github', url: '' });
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || '');
    const [bannerPreview, setBannerPreview] = useState(profile?.bannerUrl || '');
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const bioRef = useRef(null);

    // Auto-resize bio textarea
    const adjustBioHeight = () => {
        if (bioRef.current) {
            bioRef.current.style.height = 'auto';
            // Set max-height to avoid growing infinitely out of the screen (e.g. 300px)
            const scrollHeight = bioRef.current.scrollHeight;
            bioRef.current.style.height = `${Math.min(scrollHeight, 400)}px`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Auto-slugify username: lowercase, no spaces, only alphanumeric + hyphens
        if (name === 'username') {
            const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
            setFormData(prev => ({ ...prev, username: slug }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'bio') {
            // Give React a tick to update the DOM value before measuring
            setTimeout(adjustBioHeight, 0);
        }
    };

    const uploadFile = async (file, folder) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Upload failed');
        const { url } = await res.json();
        return url;
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        if (type === 'avatar') {
            setAvatarPreview(localUrl);
            setUploadingAvatar(true);
            try {
                const url = await uploadFile(file, 'avatars');
                setFormData(prev => ({ ...prev, avatarUrl: url }));
                setAvatarPreview(url);
            } catch (e) { console.error(e); }
            finally { setUploadingAvatar(false); }
        } else if (type === 'banner') {
            setBannerPreview(localUrl);
            setUploadingBanner(true);
            try {
                const url = await uploadFile(file, 'banners');
                setFormData(prev => ({ ...prev, bannerUrl: url }));
                setBannerPreview(url);
            } catch (e) { console.error(e); }
            finally { setUploadingBanner(false); }
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingResume(true);
        try {
            const url = await uploadFile(file, 'resumes');
            setFormData(prev => ({ ...prev, resumeUrl: url }));
        } catch (e) { console.error(e); }
        finally { setUploadingResume(false); }
    };

    const handleDeleteResume = () => {
        setFormData(prev => ({ ...prev, resumeUrl: '' }));
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
            setTimeout(adjustBioHeight, 50); // Resize after AI paste
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
                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            Public Profile Username
                            {formData.username && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 500 }}>
                                    🔗 gidy.io/u/{formData.username}
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="e.g. vsdharshan"
                        />
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
                    ref={bioRef}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="A short summary about yourself..."
                    className={`${isGeneratingBio ? styles.pulseArea : ''} ${styles.autoResizeBio}`}
                />
            </div>

            {/* ===== SECTION 4: RESUME ===== */}
            <div className={styles.section}>
                <label className={styles.sectionTitle}>Resume</label>
                {formData.resumeUrl ? (
                    <div className={styles.resumeUploadedBlock}>
                        <div className={styles.resumeInfo}>
                            <div className={styles.resumeUploadedIcon}>
                                <IconCheckCircle size={20} />
                            </div>
                            <div className={styles.resumeUploadedText}>
                                <span className={styles.resumeTitle}>Resume Uploaded</span>
                                <span className={styles.resumeSize}>Available on your public profile</span>
                            </div>
                        </div>
                        <div className={styles.resumeActions}>
                            <button
                                type="button"
                                className={`${styles.resumeBtn} ${styles.resumeReplace}`}
                                onClick={() => resumeInputRef.current?.click()}
                            >
                                Replace
                            </button>
                            <button
                                type="button"
                                className={`${styles.resumeBtn} ${styles.resumeDelete}`}
                                onClick={handleDeleteResume}
                                title="Delete Resume"
                            >
                                <IconTrash size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.resumeUpload} onClick={() => resumeInputRef.current?.click()}>
                        <div className={styles.resumeIcon}><IconDownload size={20} /></div>
                        <div className={styles.resumeText}>
                            <span>{uploadingResume ? 'Uploading...' : 'Upload your resume'}</span>
                            <span className={styles.hint}>PDF, DOC, or DOCX — Max 5MB</span>
                        </div>
                    </div>
                )}
                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className={styles.hiddenInput} />
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
