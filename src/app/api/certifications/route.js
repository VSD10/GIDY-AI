import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Certification name is required' }, { status: 400 });
        }

        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const certification = await prisma.certification.create({
            data: {
                name: data.name,
                issuer: data.issuer || null,
                date: data.date || null,
                profileId: profiles[0].id,
            },
        });

        return NextResponse.json(certification);
    } catch (error) {
        console.error('Failed to create certification:', error);
        return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
    }
}
