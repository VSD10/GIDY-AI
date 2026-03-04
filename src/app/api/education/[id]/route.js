import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
        }

        const education = await prisma.education.update({
            where: { id },
            data: {
                degree: data.degree,
                institution: data.institution,
                location: data.location,
                startDate: data.startDate,
                endDate: data.endDate,
            },
        });

        return NextResponse.json(education);
    } catch (error) {
        console.error('Failed to update education:', error);
        return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
        }

        await prisma.education.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete education:', error);
        return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
    }
}
