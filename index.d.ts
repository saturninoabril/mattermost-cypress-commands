/// <reference types="cypress" />

const { HTTP_METHOD } = require("./constants");

declare namespace Cypress {
  interface Response {
    allRequestResponses: any[];
    body: any;
    duration: number;
    headers: Object;
    isOkStatusCode: boolean;
    redirectedToUrl: string;
    requestHeaders: Object;
    status: number;
    statusText: string;
  }

  interface NewUser {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    nickname: string;
    password: string;
  }

  interface User {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    nickname: string;
    locale: string;
    position: string;
    props: Object;
    notify_props: UserNotifyProps;
  }

  interface UserNotifyProps {
    email: boolean;
    push: string;
    desktop: string;
    desktop_sound: boolean;
    mention_keys: string;
    channel: boolean;
    first_name: boolean;
  }

  interface UserFixture {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  }

  type UserStatus = "online" | "offline" | "away" | "dnd";

  type HttpMethod =
    | HTTP_METHOD.GET
    | HTTP_METHOD.POST
    | HTTP_METHOD.PUT
    | HTTP_METHOD.DELETE;

  interface Channel {
    name: string;
    display_name: string;
    type: string;
    purpose: string;
    header: string;
  }

  interface Team {
    display_name: string;
    description: string;
    company_name: string;
    invite_id: string;
    allow_open_invite: boolean;
  }

  interface TeamMembers {
    team_id: string;
    user_id: string;
    roles: string;
    delete_at: number;
    scheme_user: boolean;
    scheme_admin: boolean;
    explicit_roles: string;
  }

  interface Command {
    team_id: string;
    method: string;
    trigger: string;
    url: string;
  }

  interface Preference {
    user_id: string;
    category: string;
    name: string;
    value: string;
  }

  interface IncomingWebhook {
    channel_id: string;
    display_name: string;
    description: string;
    username: string;
    icon_url: string;
  }

  interface Chainable<Subject = any> {
    // *******************************************************************************
    // Authentication
    // https://api.mattermost.com/#tag/authentication
    // *******************************************************************************

    /**
     * Login a user directly via API
     * @param username
     * @param password
     */
    apiLogin(username: string, password: string): Chainable<Response>;

    /**
     * Logout a user in session directly via API
     */
    apiLogout(): Chainable<Response>;

    // *******************************************************************************
    // Bots
    // https://api.mattermost.com/#tag/bots
    // *******************************************************************************

    /**
     * Get a page of a list of bots.
     * https://api.mattermost.com/#tag/bots/paths/~1bots/get
     */
    apiGetBots(): Chainable<Response>;

    // *******************************************************************************
    // Channels
    // https://api.mattermost.com/#tag/channels
    // *******************************************************************************

    /**
     * Create a new channel.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1direct/post
     * @param teamId - The team ID of the team to create the channel on
     * @param name - The unique handle for the channel, will be present in the channel URL
     * @param displayName - The non-unique UI name for the channel
     * @param type - 'O' for a public channel (default), 'P' for a private channel
     * @param purpose - A short description of the purpose of the channel
     * @param header - Markdown-formatted text to display in the header of the channel
     */
    apiCreateChannel(
      teamId: string,
      name: string,
      displayName: string,
      type: string = "O",
      purpose: string = "",
      header: string = ""
    ): Chainable<Response>;

    /**
     * Create a new direct message channel between two users.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1direct/post
     * @param userIds - The two user ids to be in the direct message
     */
    apiCreateDirectChannel(userIds: Array<string>): Chainable<Response>;

    /**
     * Create a new group message channel to group of users. If the logged in user's id is not included in the list, it will be appended to the end.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1group/post
     * @param userIds - User ids to be in the group message channel
     */
    apiCreateGroupChannel(userIds: Array<string>): Chainable<Response>;

    /**
     * Soft deletes a channel, by marking the channel as deleted in the database.
     * Soft deleted channels will not be accessible in the user interface.
     * Direct and group message channels cannot be deleted.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}/delete
     * @param channelId - The channel ID to be deleted
     */
    apiDeleteChannel(channelId: string): Chainable<Response>;

    /**
     * Update a channel.
     * The fields that can be updated are listed as parameters. Omitted fields will be treated as blanks.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}/put
     * @param channelId - The channel ID to be updated
     * @param channel - Channel object to be updated
     *   name - The unique handle for the channel, will be present in the channel URL
     *   display_name - The non-unique UI name for the channel
     *   type - 'O' for a public channel (default), 'P' for a private channel
     *   purpose - A short description of the purpose of the channel
     *   header - Markdown-formatted text to display in the header of the channel
     */
    apiUpdateChannel(channelId: string, channel: Channel): Chainable<Response>;

    /**
     * Partially update a channel by providing only the fields you want to update.
     * Omitted fields will not be updated.
     * The fields that can be updated are defined in the request body, all other provided fields will be ignored.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}~1patch/put
     * @param channelId - The channel ID to be patched
     * @param channel - Channel object to be patched
     *   name - The unique handle for the channel, will be present in the channel URL
     *   display_name - The non-unique UI name for the channel
     *   type - 'O' for a public channel (default), 'P' for a private channel
     *   purpose - A short description of the purpose of the channel
     *   header - Markdown-formatted text to display in the header of the channel
     */
    apiPatchChannel(channelId: string, channel: Channel): Chainable<Response>;

    /**
     * Gets a channel from the provided team name and channel name strings.
     * https://api.mattermost.com/#tag/channels/paths/~1teams~1name~1{team_name}~1channels~1name~1{channel_name}/get
     * @param teamName - Team name
     * @param channelName - Channel name
     */
    apiGetChannelByName(
      teamName: string,
      channelName: string
    ): Chainable<Response>;

    /**
     * Get channel from the provided channel id string.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}/get
     * @param channelId - Channel ID
     */
    apiGetChannel(channelId: string): Chainable<Response>;

    /**
     * Add a user to a channel by creating a channel member object.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}~1members/post
     * @param channelId - Channel ID
     * @param userId - User ID
     */
    apiAddUserToChannel(channelId: string, userId: string): Chainable<Response>;

    // *******************************************************************************
    // Commands
    // https://api.mattermost.com/#tag/commands
    // *******************************************************************************

    /**
     * Create a command for a team.
     * https://api.mattermost.com/#tag/commands/paths/~1commands/post
     * @param command - command to be created
     */
    apiCreateCommand(command: Command): Chainable<Response>;

    // *******************************************************************************
    // Team
    // https://api.mattermost.com/#tag/teams
    // *******************************************************************************

    /**
     * Get a team on the system
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}/get
     * @param teamId - Team GUID
     */
    apiGetTeam(teamId: string): Chainable<Response>;

    /**
     * Create a new team on the system.
     * https://api.mattermost.com/#tag/teams/paths/~1teams/post
     * @param name - Unique handler for a team, will be present in the team URL
     * @param displayName - Non-unique UI name for the team
     * @param type - 'O' for open (default), 'I' for invite only
     */
    apiCreateTeam(
      name: string,
      displayName: string,
      type: string = "O"
    ): Chainable<Response>;

    /**
     * Soft deletes a team, by marking the team as deleted in the database.
     * Soft deleted teams will not be accessible in the user interface.
     * Optionally use the permanent query parameter to hard delete the team for compliance reasons.
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}/delete
     * @param teamId - Team ID
     * @param permanent - false (default) or true to permanently delete a team
     */
    apiDeleteTeam(
      teamId: string,
      permanent: boolean = false
    ): Chainable<Response>;

    /**
     * Partially update a team by providing only the fields you want to update.
     * Omitted fields will not be updated.
     * The fields that can be updated are defined in the request body, all other provided fields will be ignored.
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1patch/put
     * @param teamId - Team ID
     * @param team - Team object to be updated
     */
    apiPatchTeam(teamId: string, team: Team): Chainable<Response>;

    /**
     * For regular users only returns open teams.
     * Users with the "manage_system" permission will return teams regardless of type.
     * https://api.mattermost.com/#tag/teams/paths/~1teams/get
     */
    apiGetTeams(): Chainable<Response>;

    /**
     * Get a list of teams that a user is on using "me".
     * https://api.mattermost.com/#tag/teams/paths/~1users~1{user_id}~1teams/get
     */
    apiGetMyTeams(): Chainable<Response>;

    /**
     * Add user to the team by user_id.
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1members/post
     * @param teamId - Team ID
     * @param userId - User ID
     */
    apiAddUserToTeam(teamId: string, userId: string): Chainable<Response>;

    /**
     * Add a number of users to the team by user_id.
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1members~1batch/post
     * @param teamId - Team ID
     * @param teamMembers - users to add as members of a team
     */
    apiAddUsersToTeam(
      teamId: string,
      teamMembers: TeamMembers
    ): Chainable<Response>;

    // *******************************************************************************
    // Preferences
    // https://api.mattermost.com/#tag/preferences
    // *******************************************************************************

    /**
     * Save a list of the user's preferences.
     * https://api.mattermost.com/#tag/preferences/paths/~1users~1{user_id}~1preferences/put
     * @param preferences - List of preference objects
     * @param userId - "me" (default) or User ID
     */
    apiSaveUserPreference(
      preferences: Array<Preference> = [],
      userId: string = "me"
    ): Chainable<Response>;

    /**
     * Convenient API command that saves channel display mode preference of a user
     * @param value - Either "full" (default) or "centered"
     */
    apiSaveChannelDisplayModePreference(
      value: string = "full"
    ): Chainable<Response>;

    /**
     * Convenient API command that saves message display preference of a user
     * @param value - Either "clean" (default) or "compact"
     */
    apiSaveMessageDisplayPreference(
      value: string = "clean"
    ): Chainable<Response>;

    /**
     * Convenient API command that saves show markdown preview option preference of a user
     * @param value - Either "true" to show the options (default) or "false"
     */
    apiSaveShowMarkdownPreviewPreference(
      value: string = "true"
    ): Chainable<Response>;

    /**
     * Convenient API command that saves teammate name display preference of a user
     * @param value - Either "username" (default), "nickname_full_name" or "full_name"
     */
    apiSaveTeammateNameDisplayPreference(
      value: string = "username"
    ): Chainable<Response>;

    /**
     * Convenient API command that saves theme preference of a user
     * @param value - theme object.  Will pass default value if none is provided.
     */
    apiSaveThemePreference(value: Object): Chainable<Response>;

    /**
     * Convenient API command that saves theme preference of a user
     * @param value - sidebar settings object.  Will pass default value if none is provided.
     */
    apiSaveSidebarSettingPreference(value: Object = {}): Chainable<Response>;

    /**
     * Convenient API command that saves the preference on whether to show link previews
     * @param show - Either "true" to show link and images previews (default), or "false"
     */
    apiSaveShowPreviewPreference(show: string = "true"): Chainable<Response>;

    /**
     * Convenient API command that saves the preference on whether to expand/collapse image previews
     * @param collapse - Either "true" to show previews collapsed (default), or "false"
     */
    apiSavePreviewCollapsedPreference(collapse = "true"): Chainable<Response>;

    // *******************************************************************************
    // Users
    // https://api.mattermost.com/#tag/users
    // *******************************************************************************

    /**
     * Gets current user
     * https://api.mattermost.com/#tag/users/paths/~1users~1{user_id}/get
     */
    apiGetMe(): Chainable<Response>;

    /**
     * Get a user object by providing a user email. Sensitive information will be sanitized out.
     * https://api.mattermost.com/#tag/users/paths/~1users~1email~1{email}/get
     * @param email - User Email
     */
    apiGetUserByEmail(email: string): Chainable<Response>;

    /**
     * Get a user object by providing a user email. Sensitive information will be sanitized out.
     * https://api.mattermost.com/#tag/users/paths/~1users~1usernames/post
     * @param usernames - List of usernames
     */
    apiGetUsersByUsernames(usernames: Array<string>): Chainable<Response>;

    /**
     * Convenient API command that get users who are not team members
     * https://api.mattermost.com/#tag/users/paths/~1users/get
     * @param notInTeamId - The ID of the team to exclude users for.
     * @param page - The page to select, default 0.
     * @param perPage - The number of users per page, default 60. There is a maximum limit of 200 users per page.
     */
    apiGetUsersNotInTeam(
      notInTeamId: string,
      page: number,
      perPage: number
    ): Chainable<Response>;

    /**
     * Partially update a user by providing only the fields to update.
     * Omitted fields will not be updated.
     * The fields that can be updated are defined in the request body, all other provided fields will be ignored.
     * https://api.mattermost.com/#tag/users/paths/~1users~1{user_id}~1patch/put
     * @param userId - User GUID
     * @param user - User object that is to be updated
     */
    apiPatchUser(userId, user: User): Chainable<Response>;

    /**
     * Partially update logged in user by providing only the fields to update.
     * Omitted fields will not be updated.
     * The fields that can be updated are defined in the request body, all other provided fields will be ignored.
     * https://api.mattermost.com/#tag/users/paths/~1users~1{user_id}~1patch/put
     * @param user - User object that is to be updated
     */
    apiPatchMe(user: User): Chainable<Response>;

    /**
     * Creates a new user via API, adds them to 3 teams, and sets preference to bypass tutorial.
     * Then logs in as the user
     * @param user - Object of user email, username, and password that you can optionally set.
     * @param teamIDs - list of teams to add the new user to
     * @param bypassTutorial - whether to set user preferences to bypass the tutorial on first, default true to bypass, otherwise set to false.
     * @returns {Object} - returns object containing email, username, id and password if you need it further in the test
     */
    apiCreateNewUser(
      user: NewUser,
      teamIds: Array<string>,
      bypassTutorial: boolean
    ): Chainable<Response>;

    // *******************************************************************************
    // Status
    // https://api.mattermost.com/#tag/status
    // *******************************************************************************

    /**
     * Manually set a user's status.
     * https://api.mattermost.com/#tag/status/paths/~1users~1{user_id}~1status/put
     * @param status - "online" (default), "offline", "away" or "dnd"
     */
    apiUpdateUserStatus(status: UserStatus): Chainable<Response>;

    // *******************************************************************************
    // Posts
    // https://api.mattermost.com/#tag/posts
    // *******************************************************************************

    /**
     * Manually set a user's status.
     * https://api.mattermost.com/#tag/status/paths/~1users~1{user_id}~1status/put
     * @param status - "online" (default), "offline", "away" or "dnd"
     */
    apiUnpinPosts(postId: string): Chainable<Response>;

    // *******************************************************************************
    // System
    // https://api.mattermost.com/#tag/system
    // *******************************************************************************

    /**
     * Update configuration
     * https://api.mattermost.com/#tag/system/paths/~1config/put
     * @param newSetting - Mattermost configuration
     */
    apiUpdateConfig(newSetting: Object): Chainable<Response>;

    /**
     * Get configuration
     * https://api.mattermost.com/#tag/system/paths/~1config/get
     */
    apiGetConfig(): Chainable<Response>;

    /**
     * Get analytics data about the system.
     * https://api.mattermost.com/#tag/system/paths/~1analytics~1old/get
     */
    apiGetAnalytics(): Chainable<Response>;

    // *******************************************************************************
    // Webhooks
    // https://api.mattermost.com/#tag/webhooks
    // *******************************************************************************

    /**
     * Create an incoming webhook for a channel
     * https://api.mattermost.com/#tag/webhooks/paths/~1hooks~1incoming/post
     * @param hook - Incoming webhook to be created
     */
    apiCreateIncomingWebhook(hook: IncomingWebhook): Chainable<Response>;

    // *******************************************************************************
    // Convenient commands using API
    // *******************************************************************************

    /**
     * Creates a new user via the API , adds them to 3 teams, and sets preference to bypass tutorial.
     * Then logs in as the user
     * @param user - User to be created
     * @param teamIds - teams where the new user will be added
     * @param bypassTutorial - bypass tutorial (default "true"), otherwise false
     */
    loginAsNewUser(
      user: NewUser,
      teamIds: Array<string>,
      bypassTutorial: boolean
    ): Chainable<Response>;

    /**
     * Creates a new guest user via the API , adds them to 1 team with sysadmin user, and sets preference to bypass tutorial.
     * Then logs in as the user
     * @param user - User to be created
     * @param bypassTutorial - bypass tutorial (default "true"), otherwise false
     */
    loginAsNewGuestUser(
      user: NewUser,
      bypassTutorial: boolean
    ): Chainable<Response>;

    // *******************************************************************************
    // External commands using API
    // *******************************************************************************

    /**
     * externalRequest is a task which is wrapped as command with post-verification
     * that the external request is successfully completed
     * @param user - a user initiating external request
     * @param method - an HTTP method (e.g. get, post, etc)
     * @param path - API path that is relative to Cypress.config().baseUrl
     * @param data - payload
     */
    externalRequest({
      user: UserFixture,
      method: HttpMethod,
      path: string,
      data: Object
    }): Chainable<Response>;

    /**
     * Demote a Member to Guest directly via API
     * @param requestor - a user requesting to demote a user
     * @param userIdToDemote - User ID to demote
     */
    extDemoteUser({
      requestor: UserFixture,
      userIdToDemote: string
    }): Chainable<Response>;

    /**
     * Promote a Member to Guest directly via API
     * @param requestor - a user requesting to promote a user
     * @param userIdToPromote - User ID to promote
     */
    extPromoteUser({
      requestor: UserFixture,
      userIdToPromote: string
    }): Chainable<Response>;

    /**
     * Remove a User from a Channel directly via API
     * @param requestor - a user requesting to remove a user from a channel
     * @param channelId - Channel ID
     * @param userIdToRemove - User ID to remove from a channel
     */
    extRemoveUserFromChannel(
      requestor: UserFixture,
      channelId: string,
      userIdToRemove: string
    ): Chainable<Response>;

    /**
     * Remove a User from a Team directly via API
     * @param requestor - a user requesting to remove a user from a team
     * @param teamId - Channel ID
     * @param userIdToRemove - User ID to remove from a team
     */
    extRemoveUserFromTeam(
      requestor: UserFixture,
      channelId: string,
      teamId: string
    ): Chainable<Response>;
  }
}
