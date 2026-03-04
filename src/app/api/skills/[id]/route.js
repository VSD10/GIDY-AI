import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
        }

        // Delete related endorsements first (foreign key constraint)
        await prisma.endorsement.deleteMany({
            where: { skillId: id },
        });

        await prisma.skill.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete skill:', error);
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
    }
}
