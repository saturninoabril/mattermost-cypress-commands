// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const merge = require('merge-deep');

const {HEADERS, HTTP_STATUS, METHOD} = require('./constants');
const {getRandomInt, wrapResponse} = require('./utils');

// *****************************************************************************
// Authentication
// https://api.mattermost.com/#tag/authentication
// *****************************************************************************

Cypress.Commands.add('apiLogin', (username, password) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/login',
        method: METHOD.POST,
        body: {login_id: username, password},
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiLogout', () => {
    cy.request({
        headers: HEADERS,
        url: '/api/v4/users/logout',
        method: METHOD.POST,
        log: false,
    });

    // Ensure we clear out these specific cookies
    ['MMAUTHTOKEN', 'MMUSERID', 'MMCSRF'].forEach((cookie) => {
        cy.clearCookie(cookie);
    });

    // Clear remainder of cookies
    cy.clearCookies();

    cy.getCookies({log: false}).should('be.empty');
});

// *****************************************************************************
// Bots
// https://api.mattermost.com/#tag/bots
// *****************************************************************************

Cypress.Commands.add('apiGetBots', () => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/bots',
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// Channels
// https://api.mattermost.com/#tag/channels
// *****************************************************************************

Cypress.Commands.add('apiCreateChannel', (teamId, name, displayName, type = 'O', purpose = '', header = '') => {
    const uniqueName = `${name}-${getRandomInt(9999).toString()}`;

    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels',
        method: METHOD.POST,
        body: {
            team_id: teamId,
            name: uniqueName,
            display_name: displayName,
            type,
            purpose,
            header,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

Cypress.Commands.add('apiCreateDirectChannel', (userIds) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels/direct',
        method: METHOD.POST,
        body: userIds,
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

Cypress.Commands.add('apiCreateGroupChannel', (userIds = []) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels/group',
        method: METHOD.POST,
        body: userIds,
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

Cypress.Commands.add('apiDeleteChannel', (channelId) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels/' + channelId,
        method: METHOD.DELETE,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiUpdateChannel', (channelId, channel) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels/' + channelId,
        method: METHOD.PUT,
        body: {
            id: channelId,
            ...channel,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiPatchChannel', (channelId, channel) => {
    return cy.request({
        headers: HEADERS,
        method: METHOD.PUT,
        url: `/api/v4/channels/${channelId}/patch`,
        body: channel,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetChannelByName', (teamName, channelName) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/teams/name/${teamName}/channels/name/${channelName}`,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetChannel', (channelId) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/channels/${channelId}`,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiAddUserToChannel', (channelId, userId) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/channels/' + channelId + '/members',
        method: METHOD.POST,
        body: {
            user_id: userId,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

// *****************************************************************************
// Commands
// https://api.mattermost.com/#tag/commands
// *****************************************************************************

Cypress.Commands.add('apiCreateCommand', (command = {}) => {
    return cy.request({
        url: '/api/v4/commands',
        headers: HEADERS,
        method: METHOD.POST,
        body: command,
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

// *****************************************************************************
// Teams
// https://api.mattermost.com/#tag/teams
// *****************************************************************************

/**
 * Gets a team on the system
 * * @param {String} teamId - The team ID to get
 * All parameter required
 */

Cypress.Commands.add('apiGetTeam', (teamId) => {
    return cy.request({
        headers: HEADERS,
        url: `api/v4/teams/${teamId}`,
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiCreateTeam', (name, displayName, type = 'O') => {
    const uniqueName = `${name}-${getRandomInt(9999).toString()}`;

    return cy.request({
        headers: HEADERS,
        url: '/api/v4/teams',
        method: METHOD.POST,
        body: {
            name: uniqueName,
            display_name: displayName,
            type,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

Cypress.Commands.add('apiDeleteTeam', (teamId, permanent = false) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/teams/' + teamId + (permanent ? '?permanent=true' : ''),
        method: METHOD.DELETE,
    });
});

Cypress.Commands.add('apiPatchTeam', (teamId, teamData) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/teams/${teamId}/patch`,
        method: METHOD.PUT,
        body: teamData,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetTeams', () => {
    return cy.request({
        headers: HEADERS,
        url: 'api/v4/teams',
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetMyTeams', () => {
    return cy.request({
        headers: HEADERS,
        url: 'api/v4/users/me/teams',
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiAddUserToTeam', (teamId, userId) => {
    return cy.request({
        method: METHOD.POST,
        url: `/api/v4/teams/${teamId}/members`,
        headers: HEADERS,
        body: {team_id: teamId, user_id: userId},
        qs: {team_id: teamId},
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

Cypress.Commands.add('apiAddUsersToTeam', (teamId, teamMembers) => {
    return cy.request({
        method: METHOD.POST,
        url: `/api/v4/teams/${teamId}/members/batch`,
        headers: HEADERS,
        body: teamMembers,
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

// *****************************************************************************
// Preferences
// https://api.mattermost.com/#tag/preferences
// *****************************************************************************

Cypress.Commands.add('apiSaveUserPreference', (preferences = [], userId = 'me') => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/users/${userId}/preferences`,
        method: METHOD.PUT,
        body: preferences,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// Users
// https://api.mattermost.com/#tag/users
// *****************************************************************************

Cypress.Commands.add('apiGetMe', () => {
    return cy.request({
        headers: HEADERS,
        url: 'api/v4/users/me',
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetUserByEmail', (email) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/email/' + email,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetUsersByUsernames', (usernames = []) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/usernames',
        method: METHOD.POST,
        body: usernames,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetUsersNotInTeam', (notInTeamId, page = 0, perPage = 60) => {
    return cy.request({
        method: METHOD.GET,
        url: `/api/v4/users?not_in_team=${notInTeamId}&page=${page}&per_page=${perPage}`,
        headers: HEADERS,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiPatchUser', (userId, user) => {
    return cy.request({
        headers: HEADERS,
        method: METHOD.PUT,
        url: `/api/v4/users/${userId}/patch`,
        body: user,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiPatchMe', (data) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/me/patch',
        method: METHOD.PUT,
        body: data,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiCreateNewUser', (user = {}, teamIds = [], bypassTutorial = true) => {
    const timestamp = Date.now();

    const {
        email = `user${timestamp}@sample.mattermost.com`,
        username = `user${timestamp}`,
        firstName = `First${timestamp}`,
        lastName = `Last${timestamp}`,
        nickname = `Nickname${timestamp}`,
        password = 'password123'} = user;

    const createUserOption = {
        headers: HEADERS,
        method: METHOD.POST,
        url: '/api/v4/users',
        body: {email, username, first_name: firstName, last_name: lastName, password, nickname},
    };

    // # Create a new user
    return cy.request(createUserOption).then((userResponse) => {
        // Safety assertions to make sure we have a valid response
        expect(userResponse).to.have.property('body').to.have.property('id');

        const userId = userResponse.body.id;

        if (teamIds && teamIds.length > 0) {
            teamIds.forEach((teamId) => {
                cy.apiAddUserToTeam(teamId, userId);
            });
        } else {
            // Get teams, select the first three, and add new user to that team
            cy.request('GET', '/api/v4/teams').then((teamsResponse) => {
                // Verify we have at least 2 teams in the response to add the user to
                expect(teamsResponse).to.have.property('body').to.have.length.greaterThan(1);

                // Pull out only the first 2 teams
                teamsResponse.body.
                    filter((t) => t.delete_at === 0).
                    slice(0, 2).
                    map((t) => t.id).
                    forEach((teamId) => {
                        cy.apiAddUserToTeam(teamId, userId);
                    });

                // Also add the user to the default team ad-1
                teamsResponse.body.
                    filter((t) => t.name === 'ad-1').
                    map((t) => t.id).
                    forEach((teamId) => {
                        cy.apiAddUserToTeam(teamId, userId);
                    });
            });
        }

        // # If the bypass flag is true, bypass tutorial
        if (bypassTutorial === true) {
            const preferences = [{
                user_id: userId,
                category: 'tutorial_step',
                name: userId,
                value: '999',
            }];

            cy.apiSaveUserPreference(preferences, userId);
        }

        // Wrap our user object so it gets returned from our cypress command
        cy.wrap({email, username, password, id: userId, firstName, lastName, nickname});
    });
});

/**
 * Saves channel display mode preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} status - "online" (default), "offline", "away" or "dnd"
 */
Cypress.Commands.add('apiUpdateUserStatus', (status = 'online') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const data = {user_id: cookie.value, status};

        return cy.request({
            headers: HEADERS,
            url: '/api/v4/users/me/status',
            method: METHOD.PUT,
            body: data,
        }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
    });
});

// *****************************************************************************
// Posts
// https://api.mattermost.com/#tag/posts
// *****************************************************************************

/**
* Unpin a post to the channel
* https://api.mattermost.com/#tag/posts/paths/~1posts~1{post_id}~1unpin/post
* @param postId - Post GUID
*/
Cypress.Commands.add('apiUnpinPosts', (postId) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/posts/' + postId + '/unpin',
        method: METHOD.POST,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// System config
// https://api.mattermost.com/#tag/system
// *****************************************************************************

Cypress.Commands.add('apiUpdateConfig', (newSettings = {}) => {
    // # Get current settings
    return cy.apiGetConfig.then((getResponse) => {
        const oldSettings = getResponse.body;

        const settings = merge(oldSettings, newSettings);

        // # Set the modified settings
        return cy.request({
            url: '/api/v4/config',
            headers: HEADERS,
            method: METHOD.PUT,
            body: settings,
        }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
    });
});

Cypress.Commands.add('apiGetConfig', () => {
    // # Get current settings
    return cy.request({
        url: '/api/v4/config',
        headers: HEADERS,
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetAnalytics', () => {
    return cy.request({
        url: '/api/v4/analytics/old',
        headers: HEADERS,
        method: METHOD.GET,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// Webhooks
// https://api.mattermost.com/#tag/webhooks
// *****************************************************************************

Cypress.Commands.add('apiCreateIncomingWebhook', (hook = {}) => {
    return cy.request({
        url: '/api/v4/hooks/incoming',
        headers: HEADERS,
        method: METHOD.POST,
        body: hook,
    }).then((response) => wrapResponse({...response, url: `${Cypress.config().baseUrl}/hooks/${response.body.id}`}, HTTP_STATUS.OK));
});

/**
 * Demote a Member to Guest directly via API
 * @param {String} userId - The user ID
 * All parameter required
 */
Cypress.Commands.add('demoteUser', (userId) => {
    //Demote Regular Member to Guest User
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: users.sysadmin, method: METHOD.POST, baseUrl, path: `users/${userId}/demote`});
});

/**
 * Remove a User from a Channel directly via API
 * @param {String} channelId - The channel ID
 * @param {String} userId - The user ID
 * All parameter required
 */
Cypress.Commands.add('removeUserFromChannel', (channelId, userId) => {
    //Remove a User from a Channel
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: users.sysadmin, method: METHOD.DELETE, baseUrl, path: `channels/${channelId}/members/${userId}`});
});

/**
 * Remove a User from a Team directly via API
 * @param {String} teamID - The team ID
 * @param {String} userId - The user ID
 * All parameter required
 */
Cypress.Commands.add('removeUserFromTeam', (teamId, userId) => {
    //Remove a User from a Channel
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: users.sysadmin, method: METHOD.DELETE, baseUrl, path: `teams/${teamId}/members/${userId}`});
});

/**
 * Promote a Guest to a Member directly via API
 * @param {String} userId - The user ID
 * All parameter required
 */
Cypress.Commands.add('promoteUser', (userId) => {
    //Promote Regular Member to Guest User
    const baseUrl = Cypress.config('baseUrl');
    cy.externalRequest({user: users.sysadmin, method: METHOD.POST, baseUrl, path: `users/${userId}/promote`});
});

// *****************************************************************************
// Plugins
// https://api.mattermost.com/#tag/plugins
// *****************************************************************************

/**
 * Install plugin from URL directly via API.
 *
 * @param {String} pluginDownloadUrl - URL used to download the plugin
 * @param {String} force - Set to 'true' to overwrite a previously installed plugin with the same ID, if any
 */
Cypress.Commands.add('installPluginFromUrl', (pluginDownloadUrl, force = false) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/plugins/install_from_url?plugin_download_url=${encodeURIComponent(pluginDownloadUrl)}&force=${force}`,
        method: METHOD.POST,
        timeout: 60000,
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

/**
 * Uninstall plugin by id.
 *
 * @param {String} pluginId - Id of the plugin to uninstall
 */
Cypress.Commands.add('uninstallPluginById', (pluginId) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/plugins/${encodeURIComponent(pluginId)}`,
        method: METHOD.DELETE,
        failOnStatusCode: false,
    }).then((response) => {
        if (response.status !== 200 && response.status !== 404) {
            expect(response.status).to.equal(200);
        }
        return cy.wrap(response);
    });
});

/**
 * Get all user`s plugins.
 *
 */
Cypress.Commands.add('getAllPlugins', () => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/plugins',
        method: METHOD.GET,
        failOnStatusCode: false,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

/**
 * Enable plugin by id.
 *
 * @param {String} pluginId - Id of the plugin to enable
 */
Cypress.Commands.add('enablePluginById', (pluginId) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/plugins/${encodeURIComponent(pluginId)}/enable`,
        method: METHOD.POST,
        timeout: 60000,
        failOnStatusCode: true,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

/**
 * Upload binary file by name and Type *
 * @param {String} fileName - name of the plugin to upload
 * @param {String} fileType - type of the plugin to upload
 */
Cypress.Commands.add('uploadBinaryFileByName', (fileName, fileType) => {
    const formData = new FormData();

    // Get file from fixtures as binary
    cy.fixture(fileName, 'binary').then((content) => {
        // File in binary format gets converted to blob so it can be sent as Form data
        Cypress.Blob.binaryStringToBlob(content, fileType).then((blob) => {
            formData.set('plugin', blob, fileName);
            formRequest('POST', '/api/v4/plugins', formData);
        });
    });
});

/**
 * process binary file HTTP form request
 * @param {String} method - Http request method - POST/PUT
 * @param {String} url - HTTP resource URL
 * @param {FormData} FormData - Key value pairs representing form fields and value
 */
function formRequest(method, url, formData) {
    const baseUrl = Cypress.config('baseUrl');
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    let cookies = '';
    cy.getCookie('MMCSRF', {log: false}).then((token) => {
        //get MMCSRF cookie value
        const csrfToken = token.value;
        cy.getCookies({log: false}).then((cookieValues) => {
            //prepare cookie string
            cookieValues.forEach((cookie) => {
                cookies += cookie.name + '=' + cookie.value + '; ';
            });

            //set headers
            xhr.setRequestHeader('Access-Control-Allow-Origin', baseUrl);
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
            xhr.setRequestHeader('X-CSRF-Token', csrfToken);
            xhr.setRequestHeader('Cookie', cookies);
            xhr.send(formData);
            if (xhr.readyState === 4) {
                expect(xhr.status, 'Expected form request to be processed successfully').to.equal(201);
            } else {
                expect(xhr.status, 'Form request process delayed').to.equal(201);
            }
        });
    });
}

/**
 * Creates a bot directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} username - The bots username
 * @param {String} displayName - The non-unique UI name for the bot
 * @param {String} description - The description of the bot
 * All parameters are required
 */
Cypress.Commands.add('apiCreateBot', (username, displayName, description) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/bots',
        method: METHOD.POST,
        body: {
            username,
            display_name: displayName,
            description,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

/**
 * Get access token
 * This API assume that the user is logged in and has cookie to access
 * @param {String} user_id - The user id to generate token for
 * @param {String} description - The description of the token usage
 * All parameters are required
 */
Cypress.Commands.add('apiAccessToken', (userId, description) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/' + userId + '/tokens',
        method: METHOD.POST,
        body: {
            description,
        },
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

/**
 * Get LDAP Group Sync Job Status
 *
 */
Cypress.Commands.add('apiGetLDAPSync', () => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/jobs/type/ldap_sync?page=0&per_page=50',
        method: METHOD.GET,
        timeout: 60000,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// Roles
// https://api.mattermost.com/#tag/roles
// *****************************************************************************

/**
 * Get role by name.
 *
 * @param {String} roleName - Name of the role to get
 */
Cypress.Commands.add('getRoleByName', (roleName) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/roles/name/${roleName}`,
        method: METHOD.GET,
        timeout: 60000,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

/**
 * Patch a role.
 *
 * @param {String} roleID - ID of the role to patch
 * @param {String} force - Set to 'true' to overwrite a previously installed plugin with the same ID, if any
 */
Cypress.Commands.add('patchRole', (roleID, patch) => {
    return cy.request({
        headers: HEADERS,
        url: `/api/v4/roles/${roleID}/patch`,
        method: METHOD.PUT,
        timeout: 60000,
        body: patch,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});
