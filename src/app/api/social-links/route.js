import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.platform || !data.url) {
            return NextResponse.json({ error: 'Platform and URL are required' }, { status: 400 });
        }

        const profiles = await prisma.profile.findMany();
        if (profiles.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const link = await prisma.socialLink.create({
            data: {
                platform: data.platform,
                url: data.url,
                profileId: profiles[0].id,
            },
        });

        return NextResponse.json(link);
    } catch (error) {
        console.error('Failed to create social link:', error);
        return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
    }
}
