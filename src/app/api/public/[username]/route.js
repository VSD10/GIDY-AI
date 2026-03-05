import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    const { username } = await params;

    try {
        const profile = await prisma.profile.findUnique({
            where: { username },
            include: {
                skills: {
                    include: { endorseRecords: true },
                },
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startDate: 'desc' } },
                certifications: true,
                socialLinks: true,
            },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Compute endorsement counts, strip internal endorseRecords
        profile.skills = profile.skills.map(skill => ({
            ...skill,
            endorsements: skill.endorseRecords.length,
            endorseRecords: undefined,
        }));

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Public profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
