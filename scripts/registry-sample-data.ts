import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    // Hash the common password for all users
    const password = '108449123Dss';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Users (3 regular users, 1 admin, 2 drivers)
    const users = await prisma.user.createMany({
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
          name: 'Rebeca',
          email: 'rebeca@gmail.com',
          number: '912345678', // Generated phone number
          password: hashedPassword,
          role: 'USER',
        },
        {
          name: 'Fernando',
          email: 'fernando@gmail.com',
          number: '923456789', // Generated phone number
          password: hashedPassword,
          role: 'ADMIN',
        },
        {
          name: 'Orlando',
          email: 'orlando@gmail.com',
          number: '911223344',
          password: hashedPassword,
          role: 'DRIVER',
        },
        {
          name: 'Laurentino',
          email: 'laurentino@gmail.com',
          number: '922334455',
          password: hashedPassword,
          role: 'DRIVER',
        },
      ],
    });
    console.log('Users created:', users.count);

    // Fetch driver users for bus assignment
    const orlando = await prisma.user.findUnique({
      where: { email: 'orlando@gmail.com' },
    });
    const laurentino = await prisma.user.findUnique({
      where: { email: 'laurentino@gmail.com' },
    });

    // Check if drivers were found
    if (!orlando || !laurentino) {
      console.error(
        'Error: One or both drivers (Orlando, Laurentino) not found.',
      );
      throw new Error('Failed to find driver users.');
    }

    // Create Routes (5 routes, 2 assigned to Orlando and Laurentino's buses)
    const routes = await prisma.route.createMany({
      data: [
        {
          name: 'Luanda Central to Viana',
          origin: 'Luanda Central',
          destination: 'Viana',
          departureTime: '08:00',
          estimatedTime: '01:00',
          arrivalTime: '09:00',
          status: 'active',
        },
        {
          name: 'Luanda Sul to Cacuaco',
          origin: 'Luanda Sul',
          destination: 'Cacuaco',
          departureTime: '07:30',
          estimatedTime: '01:30',
          arrivalTime: '09:00',
          status: 'active',
        },
        {
          name: 'Luanda to Talatona',
          origin: 'Luanda Central',
          destination: 'Talatona',
          departureTime: '09:00',
          estimatedTime: '00:45',
          arrivalTime: '09:45',
          status: 'active',
        },
        {
          name: 'Luanda to Kilamba',
          origin: 'Luanda Central',
          destination: 'Kilamba',
          departureTime: '10:00',
          estimatedTime: '01:15',
          arrivalTime: '11:15',
          status: 'active',
        },
        {
          name: 'Luanda to Benfica',
          origin: 'Luanda Central',
          destination: 'Benfica',
          departureTime: '11:00',
          estimatedTime: '01:00',
          arrivalTime: '12:00',
          status: 'active',
        },
      ],
    });
    console.log('Routes created:', routes.count);

    // Create Stops (10 stops, 3 for Orlando's route, 3 for Laurentino's route, 4 for others)
    const stops = await prisma.stop.createMany({
      data: [
        // Stops for Orlando's route (Luanda Central to Viana, routeId: 1)
        { name: 'Mutamba', routeId: 1 },
        { name: 'Rocha Pinto', routeId: 1 },
        { name: 'Vila de Viana', routeId: 1 },
        // Stops for Laurentino's route (Luanda Sul to Cacuaco, routeId: 2)
        { name: 'Calemba', routeId: 2 },
        { name: 'Kikolo', routeId: 2 },
        { name: 'Cacuaco Centro', routeId: 2 },
        // Stops for other routes
        { name: 'Talatona Centro', routeId: 3 },
        { name: 'Kilamba Central', routeId: 4 },
        { name: 'Benfica Praia', routeId: 5 },
        { name: 'Cidade do Kilamba', routeId: 4 },
      ],
    });
    console.log('Stops created:', stops.count);

    // Create Buses (2 buses, assigned to Orlando and Laurentino)
    const buses = await prisma.bus.createMany({
      data: [
        {
          matricula: 'LDA-123-45',
          driverId: orlando.id,
          routeId: 1, // Luanda Central to Viana
          status: 'IN_TRANSIT',
          capacity: 50,
          currentLoad: 30,
          location: 'Mutamba, Luanda',
        },
        {
          matricula: 'LDA-678-90',
          driverId: laurentino.id,
          routeId: 2, // Luanda Sul to Cacuaco
          status: 'IN_TRANSIT',
          capacity: 40,
          currentLoad: 25,
          location: 'Calemba, Luanda',
        },
      ],
    });
    console.log('Buses created:', buses.count);

    console.log('Sample data created successfully.');
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData().catch((error) => {
  console.error(error);
  process.exit(1);
});
