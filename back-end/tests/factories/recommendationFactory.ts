import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';
import { CreateRecommendationData } from '../../src/services/recommendationsService.js';

export function getMockRecommendation() {
  return {
    id: Math.floor(Math.random() * 100) + 1,
    score: 0,
    name: faker.music.songName(),
    youtubeLink: 'https://www.youtube.com/watch?v=V64QUd69cFI',
  }
}

export function getQtyMockRecommendation(quantity: number): Recommendation[] {
  const recommendations : Recommendation[] = [];
  for (let i = 0; i < quantity; i++) {  
    const recommendation = getMockRecommendation();
    recommendation.score = i;
    recommendations.push(recommendation);
  }
  return recommendations;
}

export function getManyMockRecommendation(): Recommendation[] {
  const quantity = 30;
  const recommendations : Recommendation[] = [];
  for (let i = 0; i < quantity; i++) {
    const recommendation = getMockRecommendation();
    recommendation.score = i - 5;
    recommendations.push(recommendation);
  }
  return recommendations;
}

export const createMockRecommendation: CreateRecommendationData = {
  name: faker.music.songName(),
  youtubeLink: 'https://www.youtube.com/watch?v=2WtL_C3aHeM',
}