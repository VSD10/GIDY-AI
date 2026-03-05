'use client';
import { useEffect, useState } from 'react';
import styles from './PublicProfile.module.css';

function SocialIcon({ platform }) {
    switch (platform?.toLowerCase()) {
        case 'github':
            return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
        case 'linkedin':
            return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
        default:
            return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
    }
}

export default function PublicProfilePage({ params }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/public/${params.username}`);
                if (res.status === 404) { setNotFound(true); return; }
                if (!res.ok) throw new Error();
                setProfile(await res.json());
            } catch { setNotFound(true); }
            finally { setLoading(false); }
        }
        load();
    }, [params.username]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setShareOpen(false);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(`Check out ${profile?.name}'s profile on Gidy!`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        setShareOpen(false);
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        setShareOpen(false);
    };

    if (loading) return (
        <div className={styles.loadWrap}>
            <div className={styles.spinner} />
            <p>Loading profile…</p>
        </div>
    );

    if (notFound) return (
        <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>👤</div>
            <h2>Profile not found</h2>
            <p>No profile exists at <strong>/u/{params.username}</strong></p>
            <a href="/" className={styles.backBtn}>← Go Home</a>
        </div>
    );

    const skillColors = ['#00bfa5', '#8b5cf6', '#f0883e', '#3b82f6', '#ec4899', '#10b981'];

    return (
        <div className={styles.page}>
            {/* ── HERO BANNER ── */}
            <div className={styles.banner}>
                {profile.bannerUrl
                    ? <img src={profile.bannerUrl} alt="Banner" className={styles.bannerImg} />
                    : <div className={styles.bannerGradient}>
                        <div className={styles.orb1} /><div className={styles.orb2} /><div className={styles.orb3} />
                    </div>
                }

                {/* Floating share button */}
                <button className={styles.shareBtn} onClick={handleCopy} title="Copy link">
                    {copied
                        ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg> Copied!</>
                        : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg> Share Profile</>
                    }
                </button>
            </div>

            {/* ── PROFILE IDENTITY ── */}
            <div className={styles.container}>
                <div className={styles.identityCard}>
                    <div className={styles.avatarWrap}>
                        {profile.avatarUrl
                            ? <img src={profile.avatarUrl} alt={profile.name} className={styles.avatar} />
                            : <div className={styles.avatarFallback}>{profile.name?.charAt(0).toUpperCase()}</div>
                        }
                        <span className={styles.onlineDot} />
                    </div>

                    <div className={styles.identityBody}>
                        <div className={styles.identityTop}>
                            <div>
                                <h1 className={styles.name}>{profile.name}</h1>
                                <div className={styles.tagRow}>
                                    {profile.tag && <span className={styles.tag}>{profile.tag}</span>}
                                    {profile.location && (
                                        <span className={styles.location}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            {profile.location}
                                        </span>
                                    )}
                                    <span className={styles.username}>@{profile.username}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={styles.actions}>
                                {profile.socialLinks?.map((l, i) => (
                                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title={l.platform}>
                                        <SocialIcon platform={l.platform} />
                                    </a>
                                ))}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className={styles.socialBtn} title={profile.email}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    </a>
                                )}
                                {profile.resumeUrl && (
                                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeBtn}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        Resume
                                    </a>
                                )}

                                {/* ── Share Button with Dropdown ── */}
                                <div className={styles.shareWrap}>
                                    <button
                                        className={`${styles.shareActionBtn} ${copied ? styles.shareSuccess : ''}`}
                                        onClick={() => setShareOpen(o => !o)}
                                        title="Share this profile"
                                    >
                                        {copied ? (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><polyline points="20 6 9 17 4 12" /></svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                                Share Profile
                                            </>
                                        )}
                                    </button>

                                    {shareOpen && (
                                        <div className={styles.shareDropdown}>
                                            <button className={styles.shareItem} onClick={handleCopy}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                                                Copy Link
                                            </button>
                                            <button className={styles.shareItem} onClick={handleShareTwitter}>
                                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                                Share on X
                                            </button>
                                            <button className={styles.shareItem} onClick={handleShareLinkedIn}>
                                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                Share on LinkedIn
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                    </div>
                </div>

                {/* ── STATS RIBBON ── */}
                <div className={styles.statsRibbon}>
                    <div className={styles.stat}>
                        <span className={styles.statVal}>{profile.league || 'Bronze'}</span>
                        <span className={styles.statLbl}>League</span>
                    </div>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <span className={styles.statVal}>#{profile.rank || 0}</span>
                        <span className={styles.statLbl}>Rank</span>
                    </div>
                    <div className={styles.statDiv} />
                    <div className={styles.stat}>
                        <span className={styles.statVal}>{profile.points || 0}</span>
                        <span className={styles.statLbl}>Points</span>
                    </div>
                    {profile.careerVision && <>
                        <div className={styles.statDiv} />
                        <div className={styles.stat}>
                            <span className={styles.statVal}>{profile.careerVision}</span>
                            <span className={styles.statLbl}>Career Vision</span>
                        </div>
                    </>}
                </div>

                {/* ── TWO COLUMN GRID ── */}
                <div className={styles.grid}>
                    {/* LEFT */}
                    <div className={styles.left}>

                        {/* Skills */}
                        {profile.skills?.length > 0 && (
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                    Skills
                                </h2>
                                <div className={styles.skillGrid}>
                                    {profile.skills.map((s, i) => (
                                        <div key={s.id} className={styles.skillPill} style={{ '--pill-color': skillColors[i % skillColors.length] }}>
                                            <span className={styles.skillDot} />
                                            {s.name}
                                            {s.endorsements > 0 && (
                                                <span className={styles.endorseBadge}>+{s.endorsements}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Career Vision */}
                        {(profile.careerVision || profile.growthSpace || profile.inspiredBy) && (
                            <div className={`${styles.card} ${styles.visionCard}`}>
                                <h2 className={styles.cardTitle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    Career Vision
                                </h2>
                                {profile.careerVision && <p className={styles.visionHeadline}>{profile.careerVision}</p>}
                                <div className={styles.visionItems}>
                                    {profile.currentRole && <div className={styles.visionItem}><span className={styles.visionLabel}>Growing into</span><span>{profile.currentRole}</span></div>}
                                    {profile.growthSpace && <div className={styles.visionItem}><span className={styles.visionLabel}>Growth space</span><span>{profile.growthSpace}</span></div>}
                                    {profile.inspiredBy && <div className={styles.visionItem}><span className={styles.visionLabel}>Inspired by</span><span>{profile.inspiredBy}</span></div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className={styles.right}>

                        {/* Experience */}
                        {profile.experiences?.length > 0 && (
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
                                    Experience
                                </h2>
                                <div className={styles.timeline}>
                                    {profile.experiences.map(exp => (
                                        <div key={exp.id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineTitle}>{exp.title}</div>
                                                <div className={styles.timelineSub}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                                                <div className={styles.timelineDates}>{exp.startDate} → {exp.endDate || 'Present'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {profile.educations?.length > 0 && (
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                    Education
                                </h2>
                                <div className={styles.timeline}>
                                    {profile.educations.map(edu => (
                                        <div key={edu.id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineTitle}>{edu.degree}</div>
                                                <div className={styles.timelineSub}>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
                                                <div className={styles.timelineDates}>{edu.startDate} → {edu.endDate || 'Present'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        {profile.certifications?.length > 0 && (
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
                                    Certifications
                                </h2>
                                <div className={styles.certGrid}>
                                    {profile.certifications.map(cert => (
                                        <div key={cert.id} className={styles.certCard}>
                                            <div className={styles.certName}>{cert.name}</div>
                                            {cert.issuer && <div className={styles.certIssuer}>{cert.issuer}</div>}
                                            {cert.date && <div className={styles.certDate}>{cert.date}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── FOOTER CTA ── */}
                <div className={styles.footer}>
                    <div className={styles.footerContent}>
                        <span className={styles.footerLogo}>⚡ Gidy</span>
                        <p>This profile is powered by Gidy — the developer talent platform.</p>
                        <a href="/" className={styles.ctaBtn}>Create Your Profile →</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
