import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const maxDuration = 10; // max execution time limit
export const dynamic = 'force-dynamic';



export async function GET() {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                skills: {
                    include: {
                        endorseRecords: true,
                    }
                },
                experiences: {
                    orderBy: { startDate: 'desc' }
                },
                educations: {
                    orderBy: { startDate: 'desc' }
                },
                certifications: true,
                socialLinks: true,
            },
        });

        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const profile = profiles[0];

        // Compute endorsement counts
        profile.skills = profile.skills.map(skill => ({
            ...skill,
            endorsements: skill.endorseRecords.length
        }));

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();

        // Get the first profile
        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        const profileId = profiles[0].id;

        const updatedProfile = await prisma.profile.update({
            where: { id: profileId },
            data: {
                name: data.name,
                tag: data.tag,
                bio: data.bio,
                email: data.email,
                location: data.location,
                avatarUrl: data.avatarUrl,
                bannerUrl: data.bannerUrl,
                resumeUrl: data.resumeUrl,
                careerVision: data.careerVision,
                currentRole: data.currentRole,
                growthSpace: data.growthSpace,
                inspiredBy: data.inspiredBy,
                theme: data.theme,
            },
            include: {
                skills: true,
                experiences: true,
                educations: true,
                certifications: true,
                socialLinks: true,
            }
        });

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Failed to update profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
