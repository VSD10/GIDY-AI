'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProfileHeader from '@/components/ProfileHeader';
import LevelUpProfile from '@/components/LevelUpProfile';
import Skills from '@/components/Skills';
import SkillRadar from '@/components/SkillRadar';
import { Experience, Education, Certification } from '@/components/Timeline';
import EditProfile from '@/components/Editors/EditProfile';
import EditCareerVision from '@/components/Editors/EditCareerVision';
import EditSkills from '@/components/Editors/EditSkills';
import { EditExperience, EditEducation, EditCertification } from '@/components/Editors/EditTimeline';
import styles from './page.module.css';
import { calculateCompletion, getPowerColor } from '@/lib/profileUtils';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isPublicView, setIsPublicView] = useState(false);

  // Each section has its own edit state
  const [editSection, setEditSection] = useState(null);
  // Possible values: 'profile', 'career', 'skills', 'experience', 'education', 'certification'

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // Dynamic theme syncing based on profile power
  useEffect(() => {
    if (profile) {
      const { progress } = calculateCompletion(profile);
      const powerColor = getPowerColor(progress);
      document.documentElement.style.setProperty('--accent-color', powerColor);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.theme) setTheme(data.theme);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (profile) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile, theme: newTheme }),
        });
      } catch (err) {
        console.error('Failed to save theme preference', err);
      }
    }
  };

  const handleProfileSave = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    setEditSection(null);
  };

  const handleSkillsSave = (updatedSkills) => {
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
    setEditSection(null);
  };

  const handleExperienceSave = (updatedExp) => {
    setProfile(prev => ({ ...prev, experiences: updatedExp }));
    setEditSection(null);
  };

  const handleEducationSave = (updatedEdu) => {
    setProfile(prev => ({ ...prev, educations: updatedEdu }));
    setEditSection(null);
  };

  const handleCertificationSave = (updatedCert) => {
    setProfile(prev => ({ ...prev, certifications: updatedCert }));
    setEditSection(null);
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div>Loading Profile...</div>;
  if (!profile) return <div className={styles.error}>Profile not found. Run: <code>npx prisma db seed</code></div>;

  return (
    <>
      <Navbar
        profileName={profile.name}
        avatarUrl={profile.avatarUrl}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container">
        <ProfileHeader
          profile={profile}
          onEditProfile={() => setEditSection('profile')}
          onEditCareer={() => setEditSection('career')}
          isPublicView={isPublicView}
        />

        <div className={styles.twoColumnGrid}>
          <div className={styles.leftCol}>
            {!isPublicView && <LevelUpProfile profile={profile} onActionClick={setEditSection} />}
            <SkillRadar skills={profile.skills} />
            <Skills skills={profile.skills} onEdit={!isPublicView ? () => setEditSection('skills') : undefined} isPublicView={isPublicView} />
          </div>

          <div className={styles.rightCol}>
            <Experience experiences={profile.experiences} onEdit={!isPublicView ? () => setEditSection('experience') : undefined} isPublicView={isPublicView} />
            <Education educations={profile.educations} onEdit={!isPublicView ? () => setEditSection('education') : undefined} isPublicView={isPublicView} />
            <Certification certifications={profile.certifications} onEdit={!isPublicView ? () => setEditSection('certification') : undefined} isPublicView={isPublicView} />
          </div>
        </div>
      </main>

      {/* Floating View Toggle Button */}
      <button
        className={styles.viewToggleBtn}
        onClick={() => setIsPublicView(!isPublicView)}
      >
        {isPublicView ? 'Switch to Editor View' : 'Switch to Public View'}
      </button>

      {/* ---------- Section-Specific Edit Modals ---------- */}

      {editSection === 'profile' && (
        <EditProfile profile={profile} onClose={() => setEditSection(null)} onSave={handleProfileSave} />
      )}

      {editSection === 'career' && (
        <EditCareerVision profile={profile} onClose={() => setEditSection(null)} onSave={handleProfileSave} />
      )}

      {editSection === 'skills' && (
        <EditSkills skills={profile.skills} onClose={() => setEditSection(null)} onSave={handleSkillsSave} />
      )}

      {editSection === 'experience' && (
        <EditExperience experiences={profile.experiences} onClose={() => setEditSection(null)} onSave={handleExperienceSave} />
      )}

      {editSection === 'education' && (
        <EditEducation educations={profile.educations} onClose={() => setEditSection(null)} onSave={handleEducationSave} />
      )}

      {editSection === 'certification' && (
        <EditCertification certifications={profile.certifications} onClose={() => setEditSection(null)} onSave={handleCertificationSave} />
      )}
    </>
  );
}
