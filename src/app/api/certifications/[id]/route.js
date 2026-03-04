import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        const certification = await prisma.certification.update({
            where: { id },
            data: {
                name: data.name,
                issuer: data.issuer,
                date: data.date,
            },
        });

        return NextResponse.json(certification);
    } catch (error) {
        console.error('Failed to update certification:', error);
        return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        await prisma.certification.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete certification:', error);
        return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
    }
}
