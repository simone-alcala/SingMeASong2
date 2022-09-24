import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';

import * as factory from '../factories/recommendationFactory.js';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';

describe('RecommendationService Unit Tests', () => {
  
  const qtyRecommendations = 20;
  let recommendation    : Recommendation;
  let recommendations   : Recommendation[];
  let recommendationsQty: Recommendation[];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    recommendation      = { ...factory.mockRecommendation };
    recommendations     = [ ...factory.mockManyRecommendationWithScore() ];
    recommendationsQty  = [ ...factory.mockManyRecommendation(qtyRecommendations) ];
  })
  
  it('Should create a recommendation', async () => {

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(recommendationRepository, 'create')
      .mockResolvedValueOnce();
    
    await recommendationService.insert(recommendation);

    expect(recommendationRepository.create).toBeCalled();    
  });
  
  it('Should not create recommendation with same name and throw', async() => {
    
    const { name, youtubeLink } = recommendation;
    
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce({
      ...recommendation
    });
    jest
      .spyOn(recommendationRepository, 'create')
      .mockResolvedValueOnce();
    
    const promise = recommendationService.insert({ name, youtubeLink });
    
    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique'
    });
    expect(recommendationRepository.create).not.toBeCalled();    

  });
  
  it('Should upvote a recommendation', async() => {
    
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce({
      ...recommendation
    });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((id, operation) : any => {
      if (operation === 'increment' && id === recommendation.id) {
        return {
          score: recommendation.score++,
          ...recommendation
        }
      }
    });
        
    await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();   
    expect(recommendation.score).toBe(1);
  });
 
  it('Should not upvote recommendation when recommendation not found and throw', async() => {
    const recommendation = factory.mockRecommendation;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(null);
        
    const promise = recommendationService.upvote(recommendation.id);

    expect(promise).rejects.toEqual({
      type: 'not_found',
      message: ''
    });

    expect(recommendationRepository.updateScore).not.toBeCalled();   
  });

  it('Should downvote a recommendation and not delete it', async() => {
    
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce({
      ...recommendation
    });
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((id, operation) : any => {
      if (operation === 'decrement' && id === recommendation.id) {
        return {
          score: recommendation.score--,
          ...recommendation
        }
      }
    });
  
    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendation.score).toBe(-1);

  });

  it('Should downvote recommendation and delete it', async() => {
    
    recommendation.score = -5;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce({
      ...recommendation
    });
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((id, operation) : any => {
        if (operation === 'decrement' && id === recommendation.id) {
          return {
            score: recommendation.score--,
            ...recommendation
          }
        }
    });
    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((id) : any => {
        if (id !== recommendation.id) {
          throw new Error();
        }
    });
        
    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
    
  });

  it('Should not downvote recommendation when recommendation not found and throw', async() => {
    
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(null);
        
    const promise = recommendationService.downvote(recommendation.id);

    expect(promise).rejects.toEqual({
      type: 'not_found',
      message: ''
    });
    expect(recommendationRepository.updateScore).not.toBeCalled();   

  });

  it('Should return all recommendations', async() => {

    const recommendation1 = {
      id: Math.floor(Math.random() * 100) + 1,
      score: 0,
      name: Math.floor(Math.random()).toString(),
      youtubeLink: 'https://www.youtube.com/watch?v=V64QUd69cFI',
    };

    const recommendation2 = {
      id: Math.floor(Math.random() * 100) + 1,
      score: 0,
      name: Math.floor(Math.random()).toString(),
      youtubeLink: 'https://www.youtube.com/watch?v=V64QUd69cFI',
    }

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(
        [ recommendation1, recommendation2 ]
    );

    const result = await recommendationService.get();

    expect(result.length).toBe(2);
    expect(result).toMatchObject([recommendation1, recommendation2]);
    
  });

  it('Should return x top recommendations', async() => {
    
    const qtyToReturn = 5;
    
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockImplementationOnce((take): any => {
        return recommendationsQty.slice(0, take);
      }
    );

    const result = await recommendationService.getTop(qtyToReturn);

    expect(result.length).toBe(qtyToReturn);
    expect(result).toMatchObject(recommendationsQty.slice(0, qtyToReturn));
  });

  it(`Should return a random recommendation with score greater than 10`, async () => {
    const random = Math.random() * 0.7;    
    const expectedResult = 
      recommendations.filter(
        recommendation => recommendation.score > 10).slice(0, 10);   
    const index = Math.floor(Math.random() * expectedResult.length) + 1;

    jest
      .spyOn(Math, 'random')
      .mockImplementationOnce(() => random);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(
        expectedResult
    );

    jest
      .spyOn(Math, 'floor')
      .mockImplementationOnce(() => index);
  
    const result = await recommendationService.getRandom();
 
    expect(result).toBe(expectedResult[index]);
  });

  it(`Should return a random recommendation with score lower or equal than 10`, async () => {
    const random = (Math.random() * 0.3) + 0.7;
    const expectedResult = 
      recommendations.filter(
        recommendation => recommendation.score <= 10).slice(0, 10);   
    const index = Math.floor(Math.random() * expectedResult.length) +1;

    jest
      .spyOn(Math, 'random')
      .mockImplementationOnce(() => random);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(
        expectedResult
    );
    jest
      .spyOn(Math, 'floor')
      .mockImplementationOnce(() => index);
  
    const result = await recommendationService.getRandom();
 
    expect(result).toBe(expectedResult[index]);
  });

  it(`Should not return a random recommendation when recommendation not found`, async () => {

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce(({ score, scoreFilter }) : any => []);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => []);
   
    const promise = recommendationService.getRandom();

    expect(promise).rejects.toEqual({
      type: 'not_found',
      message: ''
    });
    
  });
  
  it(`Should return a random recommendation when score filter not match`, async () => {
    const random = Math.random() * 0.7;
    const expectedResult = 
      recommendations.filter(
        recommendation => recommendation.score <= 10).slice(0, 10);   
    const index = Math.floor(Math.random() * expectedResult.length) + 1;

    jest
      .spyOn(Math, 'random')
      .mockImplementationOnce(() => random);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce(({ score, scoreFilter }) : any => []);    
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(
      expectedResult
    );
    jest
      .spyOn(Math, 'floor')
      .mockImplementationOnce(() => index);
  
    const result = await recommendationService.getRandom();
 
    expect(result).toBe(expectedResult[index]);
  });

})