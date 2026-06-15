const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();
module.exports = { prisma, PrismaClient };
