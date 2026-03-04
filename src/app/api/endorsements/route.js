import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.skillId) {
            return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
        }

        // Determine endorser name based on user's request (or default to Anonymous)
        const endorserName = data.endorserName || 'Anonymous Gidy User';

        // Create the endorsement record
        const endorsement = await prisma.endorsement.create({
            data: {
                skillId: data.skillId,
                endorserName: endorserName,
            },
        });

        // We don't need to manually increment the count since we compute it 
        // dynamically using the records in the profile GET endpoint.

        // Return updated count for immediate UI update
        const count = await prisma.endorsement.count({
            where: { skillId: data.skillId }
        });

        return NextResponse.json({ ...endorsement, currentCount: count });
    } catch (error) {
        console.error('Failed to endorse skill:', error);
        return NextResponse.json({ error: 'Failed to endorse skill' }, { status: 500 });
    }
}
