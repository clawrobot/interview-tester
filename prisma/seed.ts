// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.question.createMany({
        data: [
            { text: "Tell me about yourself." },
            { text: "Describe a time you resolved a conflict at work." },
            { text: "What's your greatest strength?" },
        ],
    });
    console.log("Seeded questions");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
