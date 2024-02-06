import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 5; i++) {
    const templateChecklist = await prisma.templateChecklist.create({
      data: {
        name: `Template Checklist ${i}`,
        checklistItems: {
          create: [
            {
              name: `Item 1`,
              taskStatus: 'red',
              ordinalNumber: 1,
            },
            {
              name: `Item 2`,
              taskStatus: 'red',
              ordinalNumber: 2,
            },
            {
              name: `Item 3`,
              taskStatus: 'yellow',
              ordinalNumber: 3,
            },
            {
              name: `Item 4`,
              taskStatus: 'orange',
              ordinalNumber: 4,
            },
            {
              name: `Item 5`,
              taskStatus: 'purple',
              ordinalNumber: 5,
            },
            {
              name: `Item 6`,
              taskStatus: 'blue',
              ordinalNumber: 6,
            },
            {
              name: `Item 7`,
              taskStatus: 'green',
              ordinalNumber: 7,
            },
          ],
        },
      },
    });

    console.log(`Created template checklist with ID: ${templateChecklist.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
