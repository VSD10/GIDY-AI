import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
        }

        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const skill = await prisma.skill.create({
            data: {
                name: data.name,
                profileId: profiles[0].id,
            },
            // Include endorseRecords to ensure the payload shape matches existing ones
            include: {
                endorseRecords: true
            }
        });

        return NextResponse.json(skill);
    } catch (error) {
        console.error('Failed to create skill:', error);
        return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
    }
}
