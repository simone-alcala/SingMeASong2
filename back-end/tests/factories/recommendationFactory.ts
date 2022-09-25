import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';
import { Recommendation } from '@prisma/client';
import { CreateRecommendationData } from '../../src/services/recommendationsService.js';

export function getNewRecommendation() : CreateRecommendationData {
  return {
    name: faker.word.noun(),
    youtubeLink: 'https://www.youtube.com/watch?v=2WtL_C3aHeM',
  }
}

export async function create(data: CreateRecommendationData) {
  return await prisma.recommendation.create({ data });
}

export async function createMany(quantity: number, score?: number) {
  const data: Omit<Recommendation, 'id'>[] = [];

  for (let i = 0; i < quantity ; i ++) {
    const recommendation = {
      ...getNewRecommendation(),
      score: i - 5
    }
    data.push(recommendation);
  }
  
  await prisma.recommendation.createMany({ data });
}

export async function findAll() {
  return await prisma.recommendation.findMany();
}

export async function findLastTenAllOrderedById() {
  return await prisma.recommendation.findMany({ 
    orderBy: { id: 'desc' }, 
    take: 10
  });
}

export async function findManyWithScoreFilter(score: number, filter: 'gt' | 'lte') {
  return prisma.recommendation.findMany({
    where: {
      score: { [filter]: score },
    },
    orderBy: { id: 'desc' },
    take: 10
  });
}

export async function findAmountOrderedByScore(take: number) {
  return prisma.recommendation.findMany({
    orderBy: { score: 'desc' },
    take,
  });
}

export async function findByName(name: string) {
  return await prisma.recommendation.findUnique({ where: { name }});
}

export async function findById(id: number) {
  return await prisma.recommendation.findUnique({ where: { id }});
}

export async function updateScore(id: number, score: number) {
  await prisma.recommendation.update({ 
    where: { id },
    data: { score },
  });
}
