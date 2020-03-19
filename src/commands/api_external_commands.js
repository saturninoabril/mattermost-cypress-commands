// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {HTTP_METHOD} = require('./constants');

Cypress.Commands.add('externalRequest', ({user, method, path, data}) => {
    const baseUrl = Cypress.config('baseUrl');

    cy.task('externalRequest', {baseUrl, user, method, path, data}).its('status').should('be.equal', 200);
});

Cypress.Commands.add('extDemoteUser', (requestor, userIdToDemote) => {
    //Demote Regular Member to Guest User
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: requestor, method: HTTP_METHOD.POST, baseUrl, path: `users/${userIdToDemote}/demote`});
});

Cypress.Commands.add('extPromoteUser', (requestor, userIdToPromote) => {
    //Promote Regular Member to Guest User
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: requestor, method: HTTP_METHOD.POST, baseUrl, path: `users/${userIdToPromote}/promote`});
});

Cypress.Commands.add('extRemoveUserFromChannel', (requestor, channelId, userIdToRemove) => {
    //Remove a User from a Channel
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: requestor, method: HTTP_METHOD.DELETE, baseUrl, path: `channels/${channelId}/members/${userIdToRemove}`});
});

Cypress.Commands.add('extRemoveUserFromTeam', (requestor, teamId, userIdToRemove) => {
    //Remove a User from a Channel
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: requestor, method: HTTP_METHOD.DELETE, baseUrl, path: `teams/${teamId}/members/${userIdToRemove}`});
});