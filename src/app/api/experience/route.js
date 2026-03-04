import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.title || !data.company || !data.startDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const experience = await prisma.experience.create({
            data: {
                title: data.title,
                company: data.company,
                location: data.location || null,
                startDate: data.startDate,
                endDate: data.endDate || null,
                profileId: profiles[0].id,
            },
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('Failed to create experience:', error);
        return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
    }
}
