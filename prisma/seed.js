const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.endorsement.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.profile.deleteMany();

    // Create profile
    const profile = await prisma.profile.create({
        data: {
            name: 'VS Dharshan',
            tag: 'Final-Year Student',
            bio: 'Computer Science undergraduate skilled in backend and full-stack development, with experience building AI-driven applications using Python, FastAPI, and React.js. Strong in data structures and problem solving, with 700+ coding challenges solved and a focus on scalable, real-world software systems.',
            email: 'vsdh2004@gmail.com',
            location: 'SALEM',
            avatarUrl: '/uploads/avatar.png',
            resumeUrl: '/uploads/resume.pdf',
            careerVision: 'Technical Founder',
            currentRole: 'Entry Level Professional',
            growthSpace: 'Artificial Intelligence (AI)',
            inspiredBy: 'Elon Musk',
            league: 'Bronze',
            rank: 33,
            points: 50,
            theme: 'dark',
            skills: {
                create: [
                    { name: 'JavaScript' },
                    { name: 'React' },
                    { name: 'Node.js' },
                    { name: 'Python' },
                    { name: 'Java' },
                    { name: 'MySQL' },
                    { name: 'MongoDB' },
                    { name: 'REST APIs' },
                    { name: 'Express.js' },
                    { name: 'HTML' },
                    { name: 'SQL' },
                ],
            },
            experiences: {
                create: [
                    {
                        title: 'Trainee',
                        company: 'Think Info Export Solution',
                        location: 'SALEM',
                        startDate: 'Jul 2023',
                        endDate: 'Aug 2023',
                    },
                ],
            },
            educations: {
                create: [
                    {
                        degree: 'Btech - Computer Science And Business Systems',
                        institution: 'Knowledge Institute Of Technology',
                        location: 'Salem',
                        startDate: 'Nov 2022',
                        endDate: 'Present',
                    },
                ],
            },
            socialLinks: {
                create: [
                    { platform: 'github', url: 'https://github.com/vsdharshan' },
                    { platform: 'linkedin', url: 'https://linkedin.com/in/vsdharshan' },
                ],
            },
        },
    });

    console.log('Seeded profile:', profile.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
