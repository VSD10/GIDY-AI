'use client';
import { useEffect, useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import styles from './SkillRadar.module.css';
import { IconTarget } from '@/components/Icons';

export default function SkillRadar({ skills }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Categorize flat skills into radar chart areas
        const categories = [
            { subject: 'Frontend', keywords: ['react', 'next', 'html', 'css', 'javascript', 'typescript', 'vue', 'tailwind', 'ui', 'frontend'] },
            { subject: 'Backend', keywords: ['node', 'python', 'java', 'go', 'express', 'django', 'fastapi', 'c++', 'c#', 'backend'] },
            { subject: 'Database', keywords: ['sql', 'postgres', 'mongo', 'redis', 'firebase', 'graphql', 'database'] },
            { subject: 'Cloud & DevOps', keywords: ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'linux', 'git', 'ci/cd', 'devops'] },
            { subject: 'AI & ML', keywords: ['machine learning', 'ai', 'tensorflow', 'pytorch', 'llm', 'openai', 'data'] },
            { subject: 'Architecture', keywords: ['system design', 'microservices', 'api', 'architecture', 'agile'] }
        ];

        let radarData = categories.map(cat => ({
            subject: cat.subject,
            score: 30, // Base visual padding so the polygon is never entirely empty
            fullMark: 100,
        }));

        if (skills && skills.length > 0) {
            skills.forEach(skill => {
                const name = skill.name.toLowerCase();
                let matched = false;

                radarData = radarData.map(d => {
                    const category = categories.find(c => c.subject === d.subject);
                    if (category && category.keywords.some(kw => name.includes(kw))) {
                        matched = true;
                        // Add points based on the skill (plus bonus for endorsements)
                        const bonus = (skill.endorsements || 0) * 5;
                        return { ...d, score: Math.min(d.score + 25 + bonus, 100) };
                    }
                    return d;
                });

                // If skill doesn't strictly match predefined tags, distribute vaguely for visual flair
                if (!matched) {
                    const randIndex = Math.floor(Math.random() * radarData.length);
                    radarData[randIndex].score = Math.min(radarData[randIndex].score + 15, 100);
                }
            });
        }

        setData(radarData);
    }, [skills]);

    // Handle SSR hydration mismatch by detecting client
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    if (!isClient) return <div className={`card ${styles.radarCard}`} style={{ minHeight: '380px' }}></div>;

    return (
        <div className={`card ${styles.radarCard}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <IconTarget size={16} color="var(--accent-color)" className={styles.titleIcon} />
                    Skill Radar
                </h3>
            </div>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                        {/* The spider web background grid */}
                        <PolarGrid stroke="var(--border-color)" />

                        {/* Category Labels */}
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}
                        />

                        {/* Value scale (hidden visually but enforces 0-100 bounds) */}
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(28, 33, 40, 0.95)',
                                borderColor: 'var(--accent-color)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--accent-color)' }}
                            formatter={(value) => [`${value}% Affinity`, 'Expertise']}
                        />

                        {/* The interactive colored polygon */}
                        <Radar
                            name="Expertise"
                            dataKey="score"
                            stroke="var(--accent-color)"
                            strokeWidth={2}
                            fill="var(--accent-color)"
                            fillOpacity={0.4}
                            dot={{ r: 3, fill: 'var(--card-bg)', stroke: 'var(--accent-color)', strokeWidth: 2 }}
                            activeDot={{ r: 5, fill: 'var(--accent-color)', stroke: 'white', strokeWidth: 1 }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
