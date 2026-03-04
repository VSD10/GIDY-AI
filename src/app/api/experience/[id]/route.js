import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
        }

        const experience = await prisma.experience.update({
            where: { id },
            data: {
                title: data.title,
                company: data.company,
                location: data.location,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('Failed to update experience:', error);
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
        }

        await prisma.experience.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete experience:', error);
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
