import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Social Link ID is required' }, { status: 400 });
        }

        await prisma.socialLink.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete social link:', error);
        return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
    }
}
