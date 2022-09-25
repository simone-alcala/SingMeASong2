import { beforeEach, jest } from '@jest/globals';

import app from '../../src/app.js';
import supertest from 'supertest';
import { prisma } from '../../src/database.js';
import * as factory from '../factories/recommendationFactory.js';

const agent = supertest(app);

describe('Tests Suite - Recommendations', () => {
  
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    jest.clearAllMocks();
  });

  it('Should create a recommendation and return status code 201', async () => {
    const recommendation = factory.getNewRecommendation();
    const response = await agent.post('/recommendations').send(recommendation);

    expect(response.status).toBe(201);
  });

  it('Should create a recommendation and return status code 201', async () => {
    const recommendation = factory.getNewRecommendation();

    await agent.post('/recommendations').send(recommendation);
    const createdRecommendation = await factory.findByName(recommendation.name);
    
    expect(createdRecommendation).toBeTruthy();
    expect(createdRecommendation.youtubeLink).toBe(recommendation.youtubeLink);
  });

  it('Should not create a recommendation when invalid name and return status code 422', async () => {
    
    const recommendation = factory.getNewRecommendation();
    recommendation.name = '';

    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(422);   

  });

  it('Should not create a recommendation when invalid youtubeLink and return status code 422', async () => {

    const recommendation = factory.getNewRecommendation();
    recommendation.youtubeLink = 'https://www.youtube.com';
    
    const response = await agent.post('/recommendations').send(recommendation);
    expect(response.status).toBe(422);

  }); 

  it('Should create a recommendation with same name and return status code 409', async () => {
    const recommendation = factory.getNewRecommendation();
    await factory.create(recommendation);
    const response = await agent.post('/recommendations').send(recommendation);

    expect(response.status).toBe(409);
  });

  it('Should upvote a recommendation and return status code 200', async () => {

    const recommendation = factory.getNewRecommendation();
    const newRecommendation = await factory.create(recommendation);
    
    const response = await agent
      .post(`/recommendations/${newRecommendation.id}/upvote`)
      .send(recommendation);

    const upvotedRecommendation = await factory.findById(newRecommendation.id);

    expect(response.status).toBe(200);
    expect(upvotedRecommendation.score).toBe(1);
    
  }); 

  it('Should downvote a recommendation, not delete it and return status code 200', async () => {
    
    const recommendation = factory.getNewRecommendation();
    const newRecommendation = await factory.create(recommendation);
    
    const response = await agent
      .post(`/recommendations/${newRecommendation.id}/downvote`)
      .send(recommendation);

    const upvotedRecommendation = await factory.findById(newRecommendation.id);

    expect(response.status).toBe(200);
    expect(upvotedRecommendation.score).toBe(-1);
    
  }); 

  it('Should downvote a recommendation, delete it and return status code 200', async () => {
    
    const recommendation = factory.getNewRecommendation();
    const newRecommendation = await factory.create(recommendation);
    await factory.updateScore(newRecommendation.id, -5);

    const response = await agent
      .post(`/recommendations/${newRecommendation.id}/downvote`)
      .send(recommendation);

    const upvotedRecommendation = await factory.findById(newRecommendation.id);

    expect(response.status).toBe(200);
    expect(upvotedRecommendation).toBeFalsy();
    
  }); 
  
  it('Should return the last 10 recommendation with status code 200', async () => {
    
    const quantity = 12;
    await factory.createMany(quantity);    
    const recommendations = await factory.findLastTenAllOrderedById();

    const response = await agent.get('/recommendations');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
    expect(response.body).toMatchObject(recommendations);
    
  }); 

  it('Should return a recommendation by its ID with status code 200', async () => {
    
    const quantity = 12;
    const index = Math.floor(Math.random() * quantity);
    await factory.createMany(quantity);   
    const recommendations = await factory.findAll();

    const response = await agent.get(`/recommendations/${recommendations[index].id}`);

    expect(response.status).toBe(200);
    expect(response.body).not.toBe({});
    expect(response.body).toMatchObject(recommendations[index]);
    
  }); 

  it('Should return a random recomendation with score greater than 10', async () => {
    
    const quantity = 18;
    await factory.createMany(quantity);   
       
    const random = Math.random() * 0.7;  
    jest.spyOn(Math, 'random').mockImplementationOnce(()=>random);

    const response = await agent.get('/recommendations/random');

    expect(response.status).toBe(200);
    expect(response.body.score).toBeGreaterThan(10);
    
  }); 

  it('Should return a random recomendation with score less than or equal to 10', async () => {
    
    const quantity = 18;
    await factory.createMany(quantity);    

    const random = (Math.random() * 0.3) + 0.7;
    jest.spyOn(Math, 'random').mockImplementationOnce(()=>random);

    const response = await agent.get('/recommendations/random');

    expect(response.status).toBe(200);
    expect(response.body.score).toBeLessThanOrEqual(10);
    
  }); 

  it('Should return status code 404 on random route', async () => {
 
    const response = await agent.get('/recommendations/random');
    expect(response.status).toBe(404);
  
  }); 

  it('Should return return top x recommensations ordered by score', async () => {
 
    const quantity = 20;
    await factory.createMany(quantity);    
    const amount = 7;
    const expectedResult = await factory.findAmountOrderedByScore(7);

    const response = await agent.get(`/recommendations/top/${amount}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(amount);
    expect(response.body).toMatchObject(expectedResult);
  
  }); 

});

afterAll(async () => {
  await prisma.$disconnect();
});
