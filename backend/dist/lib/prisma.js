"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectPrisma = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
// Helper to gracefully close the connection in tests or scripts
const disconnectPrisma = async () => {
    await exports.prisma.$disconnect();
};
exports.disconnectPrisma = disconnectPrisma;
//# sourceMappingURL=prisma.js.map