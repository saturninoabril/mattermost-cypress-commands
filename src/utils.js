// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

function wrapResponse(response, expectedStatus) {
    expect(response.status).to.equal(expectedStatus);
    return cy.wrap(response);
}

module.exports = {
    getRandomInt,
    wrapResponse,
};