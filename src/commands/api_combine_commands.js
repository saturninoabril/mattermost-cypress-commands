// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

Cypress.Commands.add('loginAsNewUser', (user = {}, teamIds = [], bypassTutorial = true) => {
    return cy.createNewUser(user, teamIds, bypassTutorial).then((newUser) => {
        cy.apiLogout();
        return cy.apiLogin(newUser.username, newUser.password);
    });
});

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
        return cy.loginAsNewUser(user, [team.id], bypassTutorial).then((newUser) => {
            // # Demote Regular Member to Guest User
            cy.demoteUser(newUser.id);
            cy.wrap(newUser);
        });
    });
});

// *****************************************************************************
// Preferences
// *****************************************************************************

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
