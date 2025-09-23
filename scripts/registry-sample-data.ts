import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as luandaStopsJson from '../data/luanda-stops.json';

const prisma = new PrismaClient();

function generateRandomDate(monthOffset: number) {
  const today = new Date();
  const randomDay = Math.floor(Math.random() * 28) + 1;
  today.setMonth(today.getMonth() + monthOffset);
  today.setDate(randomDay);
  return today;
}

async function ensureSampleData() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'fernando@gmail.com' } });
    if (existing) {
      console.log('Sample data already present — skipping seeding.');
      return;
    }
    console.log('No sample data found — running seeder...');
    await createSampleData();
  } catch (err) {
    console.error('Error while ensuring sample data:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

async function generateNIA(): Promise<string> {
  const result = await prisma.$transaction(async (tx) => {
    const sequence = await tx.niaSequence.upsert({
      where: { id: 1 },
      update: { lastNIA: { increment: 1 } },
      create: { id: 1, lastNIA: 1 },
    });
    return `BUS-${String(sequence.lastNIA).padStart(4, '0')}`;
  });
  return result;
}

async function createSampleData() {
  try {
    const password = '108449123Dss';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.createMany({
      data: [
        {
          name: 'Dario',
          email: 'dario@gmail.com',
          number: '945193073',
          password: hashedPassword,
          role: 'USER',
        },
        {
          name: 'Pedro',
          email: 'pedro@gmail.com',
          number: '934945740',
          password: hashedPassword,
          role: 'USER',
        },
        {
          name: 'Fernando',
          email: 'fernando@gmail.com',
          number: '923456789',
          password: hashedPassword,
          role: 'ADMIN',
        },
      ],
      skipDuplicates: true,
    });

    await prisma.driver.createMany({
      data: [
        {
          name: 'Laurentino',
          email: 'laurentino@gmail.com',
          phone: '911223344',
          password: hashedPassword,
          licenseNumber: 'LD-654321',
          experienceTime: 3,
        },
        {
          name: 'Augusto',
          email: 'augusto@gmail.com',
          phone: '944332211',
          password: hashedPassword,
          licenseNumber: 'LD-204552',
          experienceTime: 5,
        },
      ],
      skipDuplicates: true,
    });

    const laurentino = await prisma.driver.findUnique({
      where: { email: 'laurentino@gmail.com' },
    });
    const augusto = await prisma.driver.findUnique({
      where: { email: 'augusto@gmail.com' },
    });

    if (!laurentino || !augusto)
      throw new Error('Failed to find driver users.');

    const routesPayload = [
      {
        name: 'Benfica - Patriota',
        origin: 'Benfica',
        destination: 'Patriota',
        status: 'active',
        originLatitude: 8.839,
        originLongitude: 13.2894,
        destinationLatitude: 5.839,
        destinationLongitude: 15.2345,
      },
      {
        name: 'Luanda Sul - Cacuaco',
        origin: 'Luanda Sul',
        destination: 'Cacuaco',
        status: 'active',
        originLatitude: 12.839,
        originLongitude: 4.2894,
        destinationLatitude: 7.839,
        destinationLongitude: 5.2345,
      },
      {
        name: 'Luanda - Talatona',
        origin: 'Luanda Central',
        destination: 'Talatona',
        status: 'active',
        originLatitude: 8.839,
        originLongitude: 13.2894,
        destinationLatitude: 5.839,
        destinationLongitude: 15.2345,
      },
      {
        name: 'Luanda - Kilamba',
        origin: 'Luanda Central',
        destination: 'Kilamba',
        status: 'active',
        originLatitude: 8.839,
        originLongitude: 13.2894,
        destinationLatitude: 5.839,
        destinationLongitude: 15.2345,
      },
      {
        name: 'Luanda Central - Benfica',
        origin: 'Luanda Central',
        destination: 'Benfica',
        status: 'active',
        originLatitude: 8.839,
        originLongitude: 13.2894,
        destinationLatitude: 5.839,
        destinationLongitude: 15.2345,
      },
    ];

    const routeNames = routesPayload.map((r) => r.name);
    await prisma.route.createMany({
      data: routesPayload,
      skipDuplicates: true,
    });

    const createdRoutes = await prisma.route.findMany({
      where: { name: { in: routeNames } },
    });
    const routeMap = new Map<string, number>();
    const routeIds: number[] = [];
    for (const rt of createdRoutes) {
      routeMap.set(rt.name, rt.id);
      routeIds.push(rt.id);
    }

    const routeSchedulesPayload = [
      {
        routeName: 'Benfica - Patriota',
        departureLocation: 'Benfica',
        arrivalLocation: 'Patriota',
        departureTime: new Date('2025-06-23T07:00:00Z'),
        arrivalTime: new Date('2025-06-23T07:30:00Z'),
        estimatedDurationMinutes: 30,
        status: 'active',
        distanceKM: new Prisma.Decimal(12.0),
      },
      {
        routeName: 'Luanda Sul - Cacuaco',
        departureLocation: 'Luanda Sul',
        arrivalLocation: 'Cacuaco',
        departureTime: new Date('2025-06-23T14:30:00Z'),
        arrivalTime: new Date('2025-06-23T15:25:00Z'),
        estimatedDurationMinutes: 55,
        status: 'active',
        distanceKM: new Prisma.Decimal(56.0),
      },
      {
        routeName: 'Luanda - Talatona',
        departureLocation: 'Luanda Central',
        arrivalLocation: 'Talatona',
        departureTime: new Date('2025-06-23T07:30:00Z'),
        arrivalTime: new Date('2025-06-23T07:55:00Z'),
        estimatedDurationMinutes: 25,
        status: 'active',
        distanceKM: new Prisma.Decimal(54.0),
      },
      {
        routeName: 'Luanda - Kilamba',
        departureLocation: 'Luanda Central',
        arrivalLocation: 'Kilamba',
        departureTime: new Date('2025-06-23T14:30:00Z'),
        arrivalTime: new Date('2025-06-23T15:25:00Z'),
        estimatedDurationMinutes: 55,
        status: 'active',
        distanceKM: new Prisma.Decimal(56.0),
      },
    ];

    const schedulesData = routeSchedulesPayload.map((s) => {
      const routeId = routeMap.get(s.routeName);
      if (!routeId)
        throw new Error(`Route not found for schedule: ${s.routeName}`);
      return {
        routeId,
        departureLocation: s.departureLocation,
        arrivalLocation: s.arrivalLocation,
        departureTime: s.departureTime,
        arrivalTime: s.arrivalTime,
        estimatedDurationMinutes: s.estimatedDurationMinutes,
        status: s.status,
        distanceKM: s.distanceKM,
      };
    });

    await prisma.routeSchedule.createMany({
      data: schedulesData,
      skipDuplicates: true,
    });

    const luandaStops = (luandaStopsJson as any).elements;
    for (const luandaStop of luandaStops) {
      const name = (luandaStop.tags && luandaStop.tags.name) || 'N/A';
      await prisma.stop.create({
        data: { name, latitude: luandaStop.lat, longitude: luandaStop.lon },
      });
    }

    const stops = await prisma.stop.findMany({});
    const validStopIds = stops.map((s) => s.id);

    const routeStopPayload = [];
    for (const routeId of routeIds) {
      for (let i = 0; i < 3; i++) {
        const randomStopId =
          validStopIds[Math.floor(Math.random() * validStopIds.length)];
        routeStopPayload.push({ routeId, stopId: randomStopId } as never);
      }
    }

    await prisma.routeStop.createMany({
      data: routeStopPayload,
      skipDuplicates: true,
    });

    const bus1Nia = await generateNIA();
    const bus2Nia = await generateNIA();

    const createdBus1 = await prisma.bus.create({
      data: {
        nia: bus1Nia,
        matricula: 'LD-24-24-DF',
        driverId: augusto.id,
        routeId: routeIds[0],
        status: 'OFF_SERVICE',
        capacity: 50,
        currentLoad: 0,
      },
    });

    const createdBus2 = await prisma.bus.create({
      data: {
        nia: bus2Nia,
        matricula: 'LD-12-45-AB',
        driverId: laurentino.id,
        routeId: routeIds[1] ?? routeIds[0],
        status: 'OFF_SERVICE',
        capacity: 40,
        currentLoad: 0,
      },
    });

    const driverRecords = await prisma.driver.findMany({
      select: { id: true },
    });
    const driversIDs = driverRecords.map((d) => d.id);
    const busesIDs = [createdBus1.id, createdBus2.id];
    const profits = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    for (let i = 0; i < 20; i++) {
      const monthOffset = Math.floor(i / 5);
      const createdAt = generateRandomDate(monthOffset);
      const routeId = routeIds[Math.floor(Math.random() * routeIds.length)];
      const driverId =
        driversIDs[Math.floor(Math.random() * driversIDs.length)];
      const busId = busesIDs[Math.floor(Math.random() * busesIDs.length)];
      const profit = profits[Math.floor(Math.random() * profits.length)];
      const departureTime = new Date(createdAt.getTime());
      departureTime.setHours(
        departureTime.getHours() + Math.floor(Math.random() * 4),
      );
      const arrivalTime = new Date(departureTime.getTime());
      arrivalTime.setHours(
        arrivalTime.getHours() + Math.floor(Math.random() * 4) + 1,
      );
      await prisma.travel.create({
        data: {
          routeId,
          driverId,
          busId,
          profit,
          departureTime,
          arrivalTime,
          createdAt,
        },
      });
    }

    const travelCount = await prisma.travel.count();
    console.log('Travel created:', travelCount);
    console.log('✅ Sample data created successfully.');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

ensureSampleData().catch((error) => {
  console.error(error);
  process.exit(1);
});
