import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';
import { CreateRecommendationData } from '../../src/services/recommendationsService.js';

export const mockRecommendation: Recommendation = {
  id: Math.floor(Math.random() * 100) + 1,
  score: 0,
  name: faker.music.songName(),
  youtubeLink: 'https://www.youtube.com/watch?v=V64QUd69cFI',
}

export const createMockRecommendation: CreateRecommendationData = {
  name: faker.music.songName(),
  youtubeLink: 'https://www.youtube.com/watch?v=2WtL_C3aHeM',
}

export function mockManyRecommendation(quantity: number): Recommendation[] {
  const recommendations : Recommendation[] = [];
  for (let i = 0; i < quantity; i++) {  
    const recommendation = {
      id: Math.floor(Math.random() * 100) + 1,
      score: i,
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=2WtL_C3aHeM',
    };
    recommendations.push(recommendation);
  }
  return recommendations;
}

export function mockManyRecommendationWithScore(): Recommendation[] {
  const quantity = 30;
  const recommendations : Recommendation[] = [];
  for (let i = 0; i < quantity; i++) {
    const recommendation = {
      id: Math.floor(Math.random() * 100) + 1,
      score: i - 5 ,
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=2WtL_C3aHeM',
    };
    recommendations.push(recommendation);
  }
  return recommendations;
}