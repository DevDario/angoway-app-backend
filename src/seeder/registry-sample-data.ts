import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as luandaStopsJson from '../../data/luanda-stops.json';

const prisma = new PrismaClient();

function generateRandomDate(monthOffset: number) {
  const today = new Date();
  const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28
  today.setMonth(today.getMonth() + monthOffset);
  today.setDate(randomDay);
  return today;
}

async function createSampleData() {
  const password = '108449123Dss';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.createMany({
    data: [
      { name: 'Dario', email: 'dario@gmail.com', number: '945193073', password: hashedPassword, role: 'USER' },
      { name: 'Pedro', email: 'pedro@gmail.com', number: '934945740', password: hashedPassword, role: 'USER' },
      { name: 'Rebeca', email: 'rebeca@gmail.com', number: '912345678', password: hashedPassword, role: 'USER' },
      { name: 'Fernando', email: 'fernando@gmail.com', number: '923456789', password: hashedPassword, role: 'ADMIN' },
    ],
  });

  await prisma.driver.createMany({
    data: [
      { name: 'Orlando', email: 'orlando@gmail.com', phone: '911223344', password: hashedPassword, licenseNumber: 'LD-123456', experienceTime: 5 },
      { name: 'Laurentino', email: 'laurentino@gmail.com', phone: '922334455', password: hashedPassword, licenseNumber: 'LD-654321', experienceTime: 3 },
    ],
  });

  await prisma.route.createMany({
    data: [
      { name: 'Benfica - Patriota', origin: 'Benfica', destination: 'Patriota', status: 'active' },
      { name: 'Luanda Sul - Cacuaco', origin: 'Luanda Sul', destination: 'Cacuaco', status: 'active' },
      { name: 'Luanda - Talatona', origin: 'Luanda Central', destination: 'Talatona', status: 'active' },
      { name: 'Luanda - Kilamba', origin: 'Luanda Central', destination: 'Kilamba', status: 'active' },
      { name: 'Luanda Central - Benfica', origin: 'Luanda Central', destination: 'Benfica', status: 'active' },
    ],
  });

  await prisma.routeSchedule.createMany({
    data: [
      { routeId: 1, departureLocation: 'Benfica', arrivalLocation: 'Patriota', departureTime: '2025-06-23T07:00:00Z', arrivalTime: '2025-06-23T07:30:00Z', estimatedDurationMinutes: 30, status: 'active', distanceKM: 12.0 },
      { routeId: 2, departureLocation: 'Luanda Sul', arrivalLocation: 'Cacuaco', departureTime: '2025-06-23T14:30:00Z', arrivalTime: '2025-06-23T15:25:00Z', estimatedDurationMinutes: 55, status: 'active', distanceKM: 56.0 },
      { routeId: 3, departureLocation: 'Luanda Central', arrivalLocation: 'Talatona', departureTime: '2025-06-23T07:30:00Z', arrivalTime: '2025-06-23T07:55:00Z', estimatedDurationMinutes: 25, status: 'active', distanceKM: 54.0 },
      { routeId: 4, departureLocation: 'Luanda Central', arrivalLocation: 'Kilamba', departureTime: '2025-06-23T14:30:00Z', arrivalTime: '2025-06-23T15:25:00Z', estimatedDurationMinutes: 55, status: 'active', distanceKM: 56.0 },
    ],
  });

  const luandaStops = (luandaStopsJson as any).elements || [];
  for (const luandaStop of luandaStops) {
    const name = luandaStop.tags?.name || 'N/A';
    await prisma.stop.create({ data: { name, latitude: luandaStop.lat, longitude: luandaStop.lon } });
  }

  const validStopIds = (await prisma.stop.findMany({ select: { id: true } })).map((s) => s.id);
  if (validStopIds.length) {
    const rnd = () => validStopIds[Math.floor(Math.random() * validStopIds.length)];
    await prisma.routeStop.createMany({
      data: [
        { routeId: 1, stopId: rnd() }, { routeId: 1, stopId: rnd() }, { routeId: 1, stopId: rnd() },
        { routeId: 2, stopId: rnd() }, { routeId: 2, stopId: rnd() }, { routeId: 2, stopId: rnd() },
        { routeId: 3, stopId: rnd() }, { routeId: 3, stopId: rnd() }, { routeId: 3, stopId: rnd() },
        { routeId: 4, stopId: rnd() }, { routeId: 4, stopId: rnd() }, { routeId: 4, stopId: rnd() },
        { routeId: 5, stopId: rnd() }, { routeId: 5, stopId: rnd() }, { routeId: 5, stopId: rnd() },
      ],
    });
  }

  await prisma.bus.createMany({
    data: [
      { nia: 'BUS-0001', matricula: 'LD-24-24-DF', driverId: 1, routeId: 1, status: 'OFF_SERVICE', capacity: 50, currentLoad: 0 },
      { nia: 'BUS-0002', matricula: 'LD-12-45-AB', driverId: 2, routeId: 2, status: 'OFF_SERVICE', capacity: 40, currentLoad: 0 },
    ],
  });

  // create some travels (guard with existing buses/drivers)
  const driversIDs = (await prisma.driver.findMany({ select: { id: true } })).map((d) => d.id);
  const busesIDs = (await prisma.bus.findMany({ select: { id: true } })).map((b) => b.id);
  const routesIDs = (await prisma.route.findMany({ select: { id: true } })).map((r) => r.id);
  const profits = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  for (let i = 0; i < 20; i++) {
    if (!driversIDs.length || !busesIDSafe(busesIDs).length || !routesIDs.length) break;
    const monthOffset = Math.floor(i / 5);
    const createdAt = generateRandomDate(monthOffset);
    const routeId = routesIDs[Math.floor(Math.random() * routesIDs.length)];
    const driverId = driversIDs[Math.floor(Math.random() * driversIDs.length)];
    const busId = busesIDs[Math.floor(Math.random() * busesIDs.length)];
    const profit = profits[Math.floor(Math.random() * profits.length)];
    const departureTime = new Date(createdAt.getTime());
    departureTime.setHours(departureTime.getHours() + Math.floor(Math.random() * 4));
    const arrivalTime = new Date(departureTime.getTime());
    arrivalTime.setHours(arrivalTime.getHours() + Math.floor(Math.random() * 4) + 1);

    await prisma.travel.create({ data: { routeId, driverId, busId, profit, departureTime, arrivalTime, createdAt } });
  }

  console.log('✅ Sample data created successfully.');
}

function busesIDSafe(arr: number[]) {
  return arr || [];
}

/**
 * Ensure sample data exists. This function is idempotent: it checks for a known admin user
 * and only runs creation when missing.
 */
export async function ensureSampleData() {
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
