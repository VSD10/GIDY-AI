import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.degree || !data.institution || !data.startDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const education = await prisma.education.create({
            data: {
                degree: data.degree,
                institution: data.institution,
                location: data.location || null,
                startDate: data.startDate,
                endDate: data.endDate || null,
                profileId: profiles[0].id,
            },
        });

        return NextResponse.json(education);
    } catch (error) {
        console.error('Failed to create education:', error);
        return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
    }
}
