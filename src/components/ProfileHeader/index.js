'use client';
import styles from './ProfileHeader.module.css';
import { IconEdit, IconGithub, IconLinkedin, IconGlobe, IconMail, IconDownload, IconMapPin, IconTrophy, IconStar, IconTarget, IconTrendingUp, IconSparkles } from '@/components/Icons';

export default function ProfileHeader({ profile, onEditProfile, onEditCareer, isPublicView }) {
    if (!profile) return null;

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'github': return <IconGithub size={15} />;
            case 'linkedin': return <IconLinkedin size={15} />;
            default: return <IconGlobe size={15} />;
        }
    };

    return (
        <div className={styles.hero}>
            {/* ===== BANNER ===== */}
            <div className={styles.banner}>
                {profile.bannerUrl ? (
                    <img src={profile.bannerUrl} alt="Banner" className={styles.bannerImg} />
                ) : (
                    <>
                        <div className={styles.bannerMesh}></div>
                        <div className={styles.bannerOrb1}></div>
                        <div className={styles.bannerOrb2}></div>
                        <div className={styles.bannerOrb3}></div>
                    </>
                )}

                {/* Edit Profile Button — floating on banner */}
                {!isPublicView && (
                    <button className={styles.editBtn} onClick={onEditProfile} title="Edit Profile">
                        <IconEdit size={14} /> Edit
                    </button>
                )}
            </div>

            {/* ===== PROFILE IDENTITY ===== */}
            <div className={styles.identitySection}>
                {/* Avatar */}
                <div className={styles.avatarArea}>
                    <div className={styles.avatarRing}>
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {profile.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={styles.statusDot}></div>
                    </div>
                </div>

                {/* Name + Meta */}
                <div className={styles.identityContent}>
                    <div className={styles.topRow}>
                        <div className={styles.nameBlock}>
                            <h1 className={styles.name}>{profile.name}</h1>
                            <div className={styles.metaRow}>
                                {profile.tag && <span className={styles.tag}>{profile.tag}</span>}
                                {profile.location && (
                                    <span className={styles.location}>
                                        <IconMapPin size={12} /> {profile.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions — Right Side */}
                        <div className={styles.actions}>
                            {profile.socialLinks?.map((link, idx) => (
                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className={styles.socialBtn} title={link.platform}>
                                    {getSocialIcon(link.platform)}
                                </a>
                            ))}
                            {profile.email && (
                                <a href={`mailto:${profile.email}`} className={styles.socialBtn} title={profile.email}>
                                    <IconMail size={15} />
                                </a>
                            )}
                            {profile.resumeUrl && (
                                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeBtn}>
                                    <IconDownload size={14} /> Resume
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                </div>
            </div>

            {/* ===== CAREER VISION + STATS — UNIFIED BOTTOM ===== */}
            <div className={styles.bottomStrip}>
                {/* Career Vision */}
                <div className={styles.visionBlock}>
                    <div className={styles.visionHeader}>
                        <span className={styles.visionLabel}>Career Vision</span>
                        {!isPublicView && (
                            <button className={styles.editSmallBtn} onClick={onEditCareer} title="Edit Career Vision">
                                <IconEdit size={12} />
                            </button>
                        )}
                    </div>
                    <h2 className={styles.visionTitle}>{profile.careerVision || 'Define your vision'}</h2>
                    <div className={styles.visionGrid}>
                        <div className={styles.visionItem}>
                            <IconTrendingUp size={14} color="var(--accent-color)" />
                            <div className={styles.visionItemText}>
                                <span className={styles.visionItemLabel}>Growing into</span>
                                <span className={styles.visionItemValue}>{profile.currentRole || '—'}</span>
                            </div>
                        </div>
                        <div className={styles.visionItem}>
                            <IconTarget size={14} color="#f0883e" />
                            <div className={styles.visionItemText}>
                                <span className={styles.visionItemLabel}>Growth space</span>
                                <span className={styles.visionItemValue}>{profile.growthSpace || '—'}</span>
                            </div>
                        </div>
                        <div className={styles.visionItem}>
                            <IconSparkles size={14} color="#fbbf24" />
                            <div className={styles.visionItemText}>
                                <span className={styles.visionItemLabel}>Inspired by</span>
                                <span className={styles.visionItemValue}>{profile.inspiredBy || '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.stripDivider}></div>

                {/* Stats */}
                <div className={styles.statsBlock}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}><IconTrophy size={18} color="var(--accent-color)" /></div>
                        <span className={styles.statValue}>{profile.league || 'Bronze'}</span>
                        <span className={styles.statLabel}>League</span>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}><IconStar size={18} color="var(--accent-color)" /></div>
                        <span className={styles.statValue}>{profile.rank || 0}</span>
                        <span className={styles.statLabel}>Rank</span>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-color)" stroke="none">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </div>
                        <span className={styles.statValue}>{profile.points || 0}</span>
                        <span className={styles.statLabel}>Points</span>
                    </div>
                    <a href="#" className={styles.rewardsLink}>View Rewards →</a>
                </div>
            </div>
        </div>
    );
}
