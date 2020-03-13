// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const merge = require('merge-deep');

const utils = require('./utils');

const HEADERS = {'X-Requested-With': 'XMLHttpRequest'};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
};

const METHOD = {
    DELETE: 'DELETE',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
};

function wrapResponse(response, expectedStatus) {
    expect(response.status).to.equal(expectedStatus);
    return cy.wrap(response);
}

// *****************************************************************************
// Authentication
// https://api.mattermost.com/#tag/authentication
// *****************************************************************************

Cypress.Commands.add('apiLogin', (username, password) => {
    cy.request({
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
    const uniqueName = `${name}-${utils.getRandomInt(9999).toString()}`;

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
    const options = {
        url: '/api/v4/commands',
        headers: HEADERS,
        method: METHOD.POST,
        body: command,
    };

    return cy.request(options).then((response) => wrapResponse(response, HTTP_STATUS.CREATED));
});

// *****************************************************************************
// Teams
// https://api.mattermost.com/#tag/teams
// *****************************************************************************

Cypress.Commands.add('apiCreateTeam', (name, displayName, type = 'O') => {
    const uniqueName = `${name}-${utils.getRandomInt(9999).toString()}`;

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
    cy.request({
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

Cypress.Commands.add('apiSaveChannelDisplayModePreference', (value = 'full') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'channel_display_mode',
            value,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSaveMessageDisplayPreference', (value = 'clean') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'message_display',
            value,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSaveShowMarkdownPreviewPreference', (value = 'true') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'advanced_settings',
            name: 'feature_enabled_markdown_preview',
            value,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSaveTeammateNameDisplayPreference', (value = 'username') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'name_format',
            value,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSaveThemePreference', (value = {}) => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'theme',
            name: '',
            value,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

const defaultSidebarSettingPreference = {
    grouping: 'by_type',
    unreads_at_top: 'true',
    favorite_at_top: 'true',
    sorting: 'alpha',
};

Cypress.Commands.add('apiSaveSidebarSettingPreference', (value = {}) => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const newValue = {
            ...defaultSidebarSettingPreference,
            ...value,
        };

        const preference = {
            user_id: cookie.value,
            category: 'sidebar_settings',
            name: '',
            value: JSON.stringify(newValue),
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSaveShowPreviewPreference', (show = 'true') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'link_previews',
            value: show,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

Cypress.Commands.add('apiSavePreviewCollapsedPreference', (collapse = 'true') => {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'collapse_previews',
            value: collapse,
        };

        return cy.apiSaveUserPreference([preference]);
    });
});

// *****************************************************************************
// Users
// https://api.mattermost.com/#tag/users
// *****************************************************************************

/**
 * Gets current user
 * This API assume that the user is logged
 * no params required because we are using /me to refer to current user
 */

Cypress.Commands.add('apiGetMe', () => {
    return cy.request({
        headers: HEADERS,
        url: 'api/v4/users/me',
        method: METHOD.GET,
    });
});

Cypress.Commands.add('apiGetUserByEmail', (email) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/email/' + email,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiGetUsers', (usernames = []) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/users/usernames',
        method: METHOD.POST,
        body: usernames,
    });
});

/**
 * List users that are not team members
 * @param {String} teamId - The team GUID
 * @param {Integer} page - The desired page of the paginated list
 * @param {Integer} perPage - The number of users per page
 * All parameter required
 */
Cypress.Commands.add('apiGetUsersNotInTeam', (teamId, page = 0, perPage = 60) => {
    return cy.request({
        method: METHOD.GET,
        url: `/api/v4/users?not_in_team=${teamId}&page=${page}&per_page=${perPage}`,
        headers: HEADERS,
    }).then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

Cypress.Commands.add('apiPatchUser', (userId, userData) => {
    return cy.request({
        headers: HEADERS,
        method: METHOD.PUT,
        url: `/api/v4/users/${userId}/patch`,
        body: userData,
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

/**
 * Creates a new user via the API, adds them to 3 teams, and sets preference to bypass tutorial.
 * Then logs in as the user
 * @param {Object} user - Object of user email, username, and password that you can optionally set.
 * @param {Array} teamIDs - list of teams to add the new user to
 * @param {Boolean} bypassTutorial - whether to set user preferences to bypass the tutorial on first login (true) or to show it (false)
 * Otherwise use default values
 @returns {Object} Returns object containing email, username, id and password if you need it further in the test
 */

Cypress.Commands.add('createNewUser', (user = {}, teamIds = [], bypassTutorial = true) => {
    const timestamp = Date.now();

    const {
        email = `user${timestamp}@sample.mattermost.com`,
        username = `user${timestamp}`,
        firstName = `First${timestamp}`,
        lastName = `Last${timestamp}`,
        nickname = `NewE2ENickname${timestamp}`,
        password = 'password123'} = user;

    // # Login as sysadmin to make admin requests
    cy.apiLogin('sysadmin');

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
 * Creates a new user via the API , adds them to 3 teams, and sets preference to bypass tutorial.
 * Then logs in as the user
 * @param {Object} user - Object of user email, username, and password that you can optionally set.
 * @param {Boolean} bypassTutorial - Whether to set user preferences to bypass the tutorial (true) or to show it (false)
 * Otherwise use default values
 @returns {Object} Returns object containing email, username, id and password if you need it further in the test
 */
Cypress.Commands.add('loginAsNewUser', (user = {}, teamIds = [], bypassTutorial = true) => {
    return cy.createNewUser(user, teamIds, bypassTutorial).then((newUser) => {
        cy.apiLogout();
        cy.request({
            headers: HEADERS,
            url: '/api/v4/users/login',
            method: METHOD.POST,
            body: {login_id: newUser.username, password: newUser.password},
        }).then((response) => {
            expect(response.status).to.equal(200);
            cy.visit('/ad-1/channels/town-square');

            return cy.wrap(newUser);
        });
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
        });
    });
});

// *****************************************************************************
// Posts
// https://api.mattermost.com/#tag/posts
// *****************************************************************************

/**
* Unpins pinned posts of given postID directly via API
* This API assume that the user is logged in and has cookie to access
* @param {String} postId - Post ID of the pinned post to unpin
*/
Cypress.Commands.add('apiUnpinPosts', (postId) => {
    return cy.request({
        headers: HEADERS,
        url: '/api/v4/posts/' + postId + '/unpin',
        method: METHOD.POST,
    });
});

// *****************************************************************************
// System config
// https://api.mattermost.com/#tag/system
// *****************************************************************************

Cypress.Commands.add('apiUpdateConfigBasic', (newSettings = {}) => {
    // # Get current settings
    cy.request('/api/v4/config').then((response) => {
        const oldSettings = response.body;

        const settings = merge(oldSettings, newSettings);

        // # Set the modified settings
        cy.request({
            url: '/api/v4/config',
            headers: HEADERS,
            method: METHOD.PUT,
            body: settings,
        });
    });
});

Cypress.Commands.add('apiUpdateConfig', (newSettings = {}) => {
    cy.apiLogin('sysadmin');

    // # Get current settings
    cy.request('/api/v4/config').then((response) => {
        const oldSettings = response.body;

        const settings = merge(oldSettings, newSettings);

        // # Set the modified settings
        cy.request({
            url: '/api/v4/config',
            headers: HEADERS,
            method: METHOD.PUT,
            body: settings,
        });
    });

    cy.apiLogout();
});

Cypress.Commands.add('apiGetConfig', () => {
    cy.apiLogin('sysadmin');

    // # Get current settings
    return cy.request('/api/v4/config').then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

/**
 * Get some analytics data about the system.
 */
Cypress.Commands.add('apiGetAnalytics', () => {
    cy.apiLogin('sysadmin');

    return cy.request('/api/v4/analytics/old').then((response) => wrapResponse(response, HTTP_STATUS.OK));
});

// *****************************************************************************
// Webhooks
// https://api.mattermost.com/#tag/webhooks
// *****************************************************************************

Cypress.Commands.add('apiCreateWebhook', (hook = {}, isIncoming = true) => {
    const hookUrl = isIncoming ? '/api/v4/hooks/incoming' : '/api/v4/hooks/outgoing';
    const options = {
        url: hookUrl,
        headers: HEADERS,
        method: METHOD.POST,
        body: hook,
    };

    return cy.request(options).then((response) => {
        const data = response.body;
        return {...data, url: isIncoming ? `${Cypress.config().baseUrl}/hooks/${data.id}` : ''};
    });
});

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

/**
 * Creates a new guest user via the API , adds them to 1 team with sysadmin user, and sets preference to bypass tutorial.
 * Then logs in as the user
 * @param {Object} user - Object of user email, username, and password that you can optionally set.
 * @param {Boolean} bypassTutorial - Whether to set user preferences to bypass the tutorial (true) or to show it (false)
 * Otherwise use default values
 @returns {Object} Returns object containing email, username, id and password if you need it further in the test
 */
Cypress.Commands.add('loginAsNewGuestUser', (user = {}, bypassTutorial = true) => {
    // # Login as sysadmin to make admin requests
    cy.apiLogin('sysadmin');

    // # Create a New Team for Guest User
    return cy.apiCreateTeam('guest-team', 'Guest Team').then((createResponse) => {
        const team = createResponse.body;
        cy.getCookie('MMUSERID').then((cookie) => {
            // #Assign Sysadmin user to the newly created team
            cy.apiAddUserToTeam(team.id, cookie.value);
        });

        // #Create New User
        return cy.createNewUser(user, [team.id], bypassTutorial).then((newUser) => {
            // # Demote Regular Member to Guest User
            cy.demoteUser(newUser.id);
            cy.request({
                headers: HEADERS,
                url: '/api/v4/users/login',
                method: METHOD.POST,
                body: {login_id: newUser.username, password: newUser.password},
            }).then(() => {
                cy.visit(`/${team.name}`);
                return cy.wrap(newUser);
            });
        });
    });
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
