// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { faker } from '@faker-js/faker';

const baseURL = 'http://localhost:5000/recommendations';

Cypress.Commands.add('createRecommendation', () => {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: 'https://www.youtube.com/watch?v=DNe1Q7HnrXo'
  };
  cy.request('POST', baseURL, recommendation).then(() => {
    cy.request('GET', baseURL).then(data => {
      return cy.wrap(data.body);
    });
  });
});

Cypress.Commands.add('createManyRecommendations', () => { 
  for (let i = 0 ; i < 20 ; i++) {
    const recommendation = {
      name: faker.music.songName() + ' - ' + i,
      youtubeLink: 'https://www.youtube.com/watch?v=DNe1Q7HnrXo'
    };
    cy.request('POST', baseURL, recommendation);
  }
});