"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var luandaStopsJson = require("../data/luanda-stops.json");
var prisma = new client_1.PrismaClient();
function generateRandomDate(monthOffset) {
    var today = new Date();
    var randomDay = Math.floor(Math.random() * 28) + 1;
    today.setMonth(today.getMonth() + monthOffset);
    today.setDate(randomDay);
    return today;
}
function generateNIA() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var sequence;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tx.niaSequence.upsert({
                                        where: { id: 1 },
                                        update: { lastNIA: { increment: 1 } },
                                        create: { id: 1, lastNIA: 1 },
                                    })];
                                case 1:
                                    sequence = _a.sent();
                                    return [2 /*return*/, "BUS-".concat(String(sequence.lastNIA).padStart(4, '0'))];
                            }
                        });
                    }); })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function createSampleData() {
    return __awaiter(this, void 0, void 0, function () {
        var password, hashedPassword, laurentino, augusto, routesPayload, routeNames, createdRoutes, routeMap_1, routeIds, _i, createdRoutes_1, rt, routeSchedulesPayload, schedulesData, luandaStops, _a, luandaStops_1, luandaStop, name_1, stops, validStopIds, routeStopPayload, _b, routeIds_1, routeId, i, randomStopId, bus1Nia, bus2Nia, createdBus1, createdBus2, driverRecords, driversIDs, busesIDs, profits, i, monthOffset, createdAt, routeId, driverId, busId, profit, departureTime, arrivalTime, travelCount, error_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 25, 26, 28]);
                    password = '108449123Dss';
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 1:
                    hashedPassword = _d.sent();
                    return [4 /*yield*/, prisma.user.createMany({
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
                        })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, prisma.driver.createMany({
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
                        })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, prisma.driver.findUnique({
                            where: { email: 'laurentino@gmail.com' },
                        })];
                case 4:
                    laurentino = _d.sent();
                    return [4 /*yield*/, prisma.driver.findUnique({
                            where: { email: 'augusto@gmail.com' },
                        })];
                case 5:
                    augusto = _d.sent();
                    if (!laurentino || !augusto)
                        throw new Error('Failed to find driver users.');
                    routesPayload = [
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
                    routeNames = routesPayload.map(function (r) { return r.name; });
                    return [4 /*yield*/, prisma.route.createMany({
                            data: routesPayload,
                            skipDuplicates: true,
                        })];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, prisma.route.findMany({
                            where: { name: { in: routeNames } },
                        })];
                case 7:
                    createdRoutes = _d.sent();
                    routeMap_1 = new Map();
                    routeIds = [];
                    for (_i = 0, createdRoutes_1 = createdRoutes; _i < createdRoutes_1.length; _i++) {
                        rt = createdRoutes_1[_i];
                        routeMap_1.set(rt.name, rt.id);
                        routeIds.push(rt.id);
                    }
                    routeSchedulesPayload = [
                        {
                            routeName: 'Benfica - Patriota',
                            departureLocation: 'Benfica',
                            arrivalLocation: 'Patriota',
                            departureTime: new Date('2025-06-23T07:00:00Z'),
                            arrivalTime: new Date('2025-06-23T07:30:00Z'),
                            estimatedDurationMinutes: 30,
                            status: 'active',
                            distanceKM: new client_1.Prisma.Decimal(12.0),
                        },
                        {
                            routeName: 'Luanda Sul - Cacuaco',
                            departureLocation: 'Luanda Sul',
                            arrivalLocation: 'Cacuaco',
                            departureTime: new Date('2025-06-23T14:30:00Z'),
                            arrivalTime: new Date('2025-06-23T15:25:00Z'),
                            estimatedDurationMinutes: 55,
                            status: 'active',
                            distanceKM: new client_1.Prisma.Decimal(56.0),
                        },
                        {
                            routeName: 'Luanda - Talatona',
                            departureLocation: 'Luanda Central',
                            arrivalLocation: 'Talatona',
                            departureTime: new Date('2025-06-23T07:30:00Z'),
                            arrivalTime: new Date('2025-06-23T07:55:00Z'),
                            estimatedDurationMinutes: 25,
                            status: 'active',
                            distanceKM: new client_1.Prisma.Decimal(54.0),
                        },
                        {
                            routeName: 'Luanda - Kilamba',
                            departureLocation: 'Luanda Central',
                            arrivalLocation: 'Kilamba',
                            departureTime: new Date('2025-06-23T14:30:00Z'),
                            arrivalTime: new Date('2025-06-23T15:25:00Z'),
                            estimatedDurationMinutes: 55,
                            status: 'active',
                            distanceKM: new client_1.Prisma.Decimal(56.0),
                        },
                    ];
                    schedulesData = routeSchedulesPayload.map(function (s) {
                        var routeId = routeMap_1.get(s.routeName);
                        if (!routeId)
                            throw new Error("Route not found for schedule: ".concat(s.routeName));
                        return {
                            routeId: routeId,
                            departureLocation: s.departureLocation,
                            arrivalLocation: s.arrivalLocation,
                            departureTime: s.departureTime,
                            arrivalTime: s.arrivalTime,
                            estimatedDurationMinutes: s.estimatedDurationMinutes,
                            status: s.status,
                            distanceKM: s.distanceKM,
                        };
                    });
                    return [4 /*yield*/, prisma.routeSchedule.createMany({
                            data: schedulesData,
                            skipDuplicates: true,
                        })];
                case 8:
                    _d.sent();
                    luandaStops = luandaStopsJson.elements;
                    _a = 0, luandaStops_1 = luandaStops;
                    _d.label = 9;
                case 9:
                    if (!(_a < luandaStops_1.length)) return [3 /*break*/, 12];
                    luandaStop = luandaStops_1[_a];
                    name_1 = (luandaStop.tags && luandaStop.tags.name) || 'N/A';
                    return [4 /*yield*/, prisma.stop.create({
                            data: { name: name_1, latitude: luandaStop.lat, longitude: luandaStop.lon },
                        })];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, prisma.stop.findMany({})];
                case 13:
                    stops = _d.sent();
                    validStopIds = stops.map(function (s) { return s.id; });
                    routeStopPayload = [];
                    for (_b = 0, routeIds_1 = routeIds; _b < routeIds_1.length; _b++) {
                        routeId = routeIds_1[_b];
                        for (i = 0; i < 3; i++) {
                            randomStopId = validStopIds[Math.floor(Math.random() * validStopIds.length)];
                            routeStopPayload.push({ routeId: routeId, stopId: randomStopId });
                        }
                    }
                    return [4 /*yield*/, prisma.routeStop.createMany({
                            data: routeStopPayload,
                            skipDuplicates: true,
                        })];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, generateNIA()];
                case 15:
                    bus1Nia = _d.sent();
                    return [4 /*yield*/, generateNIA()];
                case 16:
                    bus2Nia = _d.sent();
                    return [4 /*yield*/, prisma.bus.create({
                            data: {
                                nia: bus1Nia,
                                matricula: 'LD-24-24-DF',
                                driverId: augusto.id,
                                routeId: routeIds[0],
                                status: 'OFF_SERVICE',
                                capacity: 50,
                                currentLoad: 0,
                            },
                        })];
                case 17:
                    createdBus1 = _d.sent();
                    return [4 /*yield*/, prisma.bus.create({
                            data: {
                                nia: bus2Nia,
                                matricula: 'LD-12-45-AB',
                                driverId: laurentino.id,
                                routeId: (_c = routeIds[1]) !== null && _c !== void 0 ? _c : routeIds[0],
                                status: 'OFF_SERVICE',
                                capacity: 40,
                                currentLoad: 0,
                            },
                        })];
                case 18:
                    createdBus2 = _d.sent();
                    return [4 /*yield*/, prisma.driver.findMany({
                            select: { id: true },
                        })];
                case 19:
                    driverRecords = _d.sent();
                    driversIDs = driverRecords.map(function (d) { return d.id; });
                    busesIDs = [createdBus1.id, createdBus2.id];
                    profits = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
                    i = 0;
                    _d.label = 20;
                case 20:
                    if (!(i < 20)) return [3 /*break*/, 23];
                    monthOffset = Math.floor(i / 5);
                    createdAt = generateRandomDate(monthOffset);
                    routeId = routeIds[Math.floor(Math.random() * routeIds.length)];
                    driverId = driversIDs[Math.floor(Math.random() * driversIDs.length)];
                    busId = busesIDs[Math.floor(Math.random() * busesIDs.length)];
                    profit = profits[Math.floor(Math.random() * profits.length)];
                    departureTime = new Date(createdAt.getTime());
                    departureTime.setHours(departureTime.getHours() + Math.floor(Math.random() * 4));
                    arrivalTime = new Date(departureTime.getTime());
                    arrivalTime.setHours(arrivalTime.getHours() + Math.floor(Math.random() * 4) + 1);
                    return [4 /*yield*/, prisma.travel.create({
                            data: {
                                routeId: routeId,
                                driverId: driverId,
                                busId: busId,
                                profit: profit,
                                departureTime: departureTime,
                                arrivalTime: arrivalTime,
                                createdAt: createdAt,
                            },
                        })];
                case 21:
                    _d.sent();
                    _d.label = 22;
                case 22:
                    i++;
                    return [3 /*break*/, 20];
                case 23: return [4 /*yield*/, prisma.travel.count()];
                case 24:
                    travelCount = _d.sent();
                    console.log('Travel created:', travelCount);
                    console.log('✅ Sample data created successfully.');
                    return [3 /*break*/, 28];
                case 25:
                    error_1 = _d.sent();
                    console.error('❌ Error creating sample data:', error_1);
                    throw error_1;
                case 26: return [4 /*yield*/, prisma.$disconnect()];
                case 27:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
}
createSampleData().catch(function (error) {
    console.error(error);
    process.exit(1);
});
