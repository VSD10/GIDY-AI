import { IconZap, IconStar, IconTarget, IconTrendingUp } from '@/components/Icons';

export function calculateCompletion(profile) {
    if (!profile) return { progress: 0, completed: [], missing: [], checks: [] };

    const checks = [
        { label: 'Profile Photo', weight: 15, action: 'profile', done: !!profile.avatarUrl, icon: <IconStar size={14} /> },
        { label: 'Bio', weight: 15, action: 'profile', done: !!profile.bio && profile.bio.length > 10, icon: <IconTrendingUp size={14} /> },
        { label: 'Career Vision', weight: 10, action: 'career', done: !!profile.careerVision, icon: <IconTarget size={14} /> },
        { label: 'Email', weight: 5, action: 'profile', done: !!profile.email, icon: <IconZap size={14} /> },
        { label: 'Location', weight: 5, action: 'profile', done: !!profile.location, icon: <IconStar size={14} /> },
        { label: 'Skills (3+)', weight: 15, action: 'skills', done: (profile.skills?.length || 0) >= 3, icon: <IconZap size={14} /> },
        { label: 'Experience', weight: 15, action: 'experience', done: (profile.experiences?.length || 0) >= 1, icon: <IconTrendingUp size={14} /> },
        { label: 'Education', weight: 10, action: 'education', done: (profile.educations?.length || 0) >= 1, icon: <IconStar size={14} /> },
        { label: 'Certifications', weight: 10, action: 'certification', done: (profile.certifications?.length || 0) >= 1, icon: <IconTarget size={14} /> },
    ];

    let progress = 0;
    const completed = [];
    const missing = [];

    checks.forEach(c => {
        if (c.done) {
            progress += c.weight;
            completed.push(c);
        } else {
            missing.push(c);
        }
    });

    return { progress: Math.min(progress, 100), completed, missing, checks };
}

export function getPowerColor(progress) {
    if (progress < 40) return '#f85149'; // Red
    if (progress < 70) return '#f0883e'; // Orange
    if (progress < 100) return '#00bfa5'; // Aqua
    return '#8b5cf6'; // Purple (Max Power)
}
