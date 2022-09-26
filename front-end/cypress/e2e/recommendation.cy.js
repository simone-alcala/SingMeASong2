import { faker } from '@faker-js/faker';

const visitURL = 'http://localhost:3000';
const baseURL = 'http://localhost:5000/recommendations';

beforeEach(async () => {
  await cy.request('DELETE', `${baseURL}/reset-database`);
});

describe('Recommendation Tests Suite', () => {

  it('Should create a recommendation with score 0', () => {

    const recommendation = {
      name: faker.music.songName(),
      youtubeLink: 'https://www.youtube.com/watch?v=DNe1Q7HnrXo'
    };

    cy.visit(visitURL)  ;
    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.youtubeLink);
    
    cy.intercept('POST', `${baseURL}`).as('create');
    
    cy.get('button').click();

    cy.wait('@create');

    cy.get('article').eq(0).find('div').eq(0).should('have.text', recommendation.name);   
    cy.get('article').eq(0).find('div').last().should('have.text', '0');
  });
  
  it('Should upvote a recommendation', () => { 
    
    cy.createRecommendation().then((result) => {

      cy.visit(visitURL);
      
      cy.intercept('POST', `${baseURL}/${result[0].id}/upvote`).as('upvote');

      cy.get('article').eq(0).find('div').last().find('svg').eq(0).click();
      
      cy.wait('@upvote');
      
      cy.get('article').eq(0).find('div').last().should('have.text', '1');

    });
    
  });

  it('Should downvote a recommendation', () => { 
    
    cy.createRecommendation().then((result) => {

      cy.visit(visitURL);
      
      cy.intercept('POST', `${baseURL}/${result[0].id}/downvote`).as('downvote');

      cy.get('article').eq(0).find('div').last().find('svg').eq(1).click();
      
      cy.wait('@downvote');
      
      cy.get('article').eq(0).find('div').last().should('have.text', '-1');

    });
    
  });

  it('Should list the top 10 recommendations', () => { 
    
    cy.createManyRecommendations().then(() => {     

      cy.intercept('GET', `${baseURL}/top/10`).as('top');
      
      cy.get('#root div').eq(0).find('div').eq(1).click();
     
      cy.wait('@top');
      
      cy.url().should('equal', `${visitURL}/top`);
      cy.get('#root').find('article').should('have.length', 10);

    });
    
  });

  it('Should show a random recommendation', () => { 
    
    cy.createManyRecommendations().then(() => {     

      cy.intercept('GET', `${baseURL}/random`).as('random');
      
      cy.get('#root div').eq(0).find('div').eq(2).click();
     
      cy.wait('@random');
      
      cy.url().should('equal', `${visitURL}/random`);
      cy.get('#root').find('article').should('have.length', 1);

    });
    
  });

  it('Should redirect to Home', () => { 
    
    cy.get('#root div').eq(0).find('div').eq(0).click();      
    cy.url().should('equal', `${visitURL}/`);

  });

});