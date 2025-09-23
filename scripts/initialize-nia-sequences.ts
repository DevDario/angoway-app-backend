import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeNiaSequence() {
  const lastBus = await prisma.bus.findFirst({
    orderBy: { nia: 'desc' },
    select: { nia: true },
  });

  let lastNumber = 0;
  if (lastBus?.nia) {
    const match = lastBus.nia.match(/(\d+)$/);
    if (match) lastNumber = parseInt(match[1], 10);
  }

  await prisma.niaSequence.upsert({
    where: { id: 1 },
    update: { lastNIA: lastNumber },
    create: { id: 1, lastNIA: lastNumber },
  }); 

  console.log(`NIA sequence initialized with lastNIA: ${lastNumber}`);
}

initializeNiaSequence()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
