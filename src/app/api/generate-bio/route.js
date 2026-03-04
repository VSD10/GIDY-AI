import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                skills: true,
                experiences: true,
                educations: true,
            },
        });

        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const p = profiles[0];
        const skillsList = p.skills.map(s => s.name).join(', ');

        const apiKey = process.env.CEREBRAS_API_KEY || request.headers.get('x-cerebras-key');

        if (apiKey) {
            // Structured Prompt for the AI
            const prompt = `You are an expert technical recruiter and professional resume writer. 
Generate a professional, engaging, and highly concise 3-sentence biography for my portfolio website.

Here are my details:
Name: ${p.name || 'Professional'}
Current Role: ${p.currentRole || p.tag || 'Software Engineer'}
Skills: ${skillsList || 'various technical domains'}
Career Vision: ${p.careerVision || 'To build impactful digital experiences'}
Growth Space: ${p.growthSpace || 'Technology'}
Inspired By: ${p.inspiredBy || 'Industry leaders'}

Rules: 
1. Write the biography in the first person ("I am..."). 
2. Do not use generic buzzwords; make it sound passionate and technically competent. 
3. Weave the skills organically into the text rather than just listing them.
4. Return ONLY the biography text. Do not include introductory phrases like "Here is your bio:".`;

            const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama3.1-8b',
                    messages: [
                        { role: 'system', content: 'You are a professional resume writer.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Cerebras API Error:', errorData);
                const errorMessage = errorData.error?.message || errorData.message || 'Failed to generate bio from Cerebras API';
                return NextResponse.json({ error: errorMessage }, { status: 500 });
            }

            const data = await response.json();
            const generatedBio = data.choices[0].message.content.trim();

            return NextResponse.json({ bio: generatedBio });
        } else {
            // Fallback logic if API key isn't provided
            let currentRoleText = 'a professional';
            if (p.currentRole || p.tag) {
                currentRoleText = `a ${p.currentRole || p.tag}`;
            }

            let experienceText = '';
            if (p.experiences && p.experiences.length > 0) {
                const latestExp = p.experiences[0];
                experienceText = ` with experience as a ${latestExp.title} at ${latestExp.company}`;
            }

            let educationText = '';
            if (p.educations && p.educations.length > 0) {
                educationText = ` educated at ${p.educations[0].institution}`;
            }

            const templates = [
                `Driven by a passion for ${p.growthSpace || 'technology'}, I am ${currentRoleText}${experienceText}. My expertise spans across ${skillsList}, enabling me to build robust, scalable solutions. ${educationText ? 'I was ' + educationText.trim() + '.' : ''} My ultimate career vision is to become a ${p.careerVision || 'leader in my field'}, inspired by visionaries like ${p.inspiredBy || 'industry leaders'}.`,
                `As ${currentRoleText}, I specialize in ${skillsList}. ${experienceText ? 'I have honed my skills' + experienceText + ',' : ''} focusing on creating impactful digital experiences. I am constantly exploring the space of ${p.growthSpace || 'innovation'}, drawing inspiration from ${p.inspiredBy || 'world-class innovators'}. Building toward my goal of becoming a ${p.careerVision || 'top professional'}, I am always eager to tackle complex challenges.`,
                `Bridging the gap between ideas and execution, I am ${currentRoleText} skilled in ${skillsList}. My journey includes ${experienceText ? experienceText.replace(' with experience', 'working') : 'continuous learning'}. With a strong foundation ${educationText ? 'from ' + p.educations[0].institution : 'in tech'}, I aspire to be a ${p.careerVision || 'trailblazer'} in ${p.growthSpace || 'the industry'}, motivated by the work of ${p.inspiredBy || 'great minds'}.`
            ];

            const randomIndex = Math.floor(Math.random() * templates.length);
            const generatedBio = templates[randomIndex];

            return NextResponse.json({ bio: generatedBio, isFallback: true });
        }
    } catch (error) {
        console.error('Failed to generate bio:', error);
        return NextResponse.json({ error: 'Failed to generate bio' }, { status: 500 });
    }
}
