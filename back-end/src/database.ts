import pkg from "@prisma/client";
const { PrismaClient } = pkg;
//import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
