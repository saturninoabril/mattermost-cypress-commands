/// <reference types="cypress" />

declare namespace Cypress {
  interface Response {
    allRequestResponses: any[];
    body: any;
    duration: number;
    headers: { [key: string]: string };
    isOkStatusCode: boolean;
    redirectedToUrl: string;
    requestHeaders: { [key: string]: string };
    status: number;
    statusText: string;
  }

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

  interface Theme {
    [key: string]: string;
  }

  interface SidebarSetting {
    [key: string]: string;
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
     *  * https://api.mattermost.com/#tag/channels/paths/~1channels~1direct/post
     * @param teamId - The team ID of the team to create the channel on
     * @param name - The unique handle for the channel, will be present in the channel URL
     * @param displayName - The non-unique UI name for the channel
     * @param type - 'O' for a public channel (default), 'P' for a private channel
     * @param purpose - A short description of the purpose of the channel
     * @param header - Markdown-formatted text to display in the header of the channel
     * All parameters required except purpose and header
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
     * All parameters required
     */
    apiCreateDirectChannel(userIds: Array<string>): Chainable<Response>;

    /**
     * Create a new group message channel to group of users. If the logged in user's id is not included in the list, it will be appended to the end.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1group/post
     * @param userIds - User ids to be in the group message channel
     * All parameters required except purpose and header
     */
    apiCreateGroupChannel(userIds: Array<string>): Chainable<Response>;

    /**
     * Soft deletes a channel, by marking the channel as deleted in the database.
     * Soft deleted channels will not be accessible in the user interface.
     * Direct and group message channels cannot be deleted.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}/delete
     * @param channelId - The channel ID to be deleted
     * All parameter required
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
     * Only channelId is required
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
     * Only channelId is required
     */
    apiPatchChannel(channelId: string, channel: Channel): Chainable<Response>;

    /**
     * Gets a channel from the provided team name and channel name strings.
     * https://api.mattermost.com/#tag/channels/paths/~1teams~1name~1{team_name}~1channels~1name~1{channel_name}/get
     * @param teamName - Team name
     * @param channelName - Channel name
     * All parameters required
     */
    apiGetChannelByName(
      teamName: string,
      channelName: string
    ): Chainable<Response>;

    /**
     * Get channel from the provided channel id string.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}/get
     * @param channelId - Channel ID
     * All parameter required
     */
    apiGetChannel(channelId: string): Chainable<Response>;

    /**
     * Add a user to a channel by creating a channel member object.
     * https://api.mattermost.com/#tag/channels/paths/~1channels~1{channel_id}~1members/post
     * @param channelId - Channel ID
     * @param userId - User ID
     * All parameter required
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
     * All parameter required
     */
    apiCreateCommand(command: Command): Chainable<Response>;

    // *******************************************************************************
    // Team
    // https://api.mattermost.com/#tag/teams
    // *******************************************************************************

    /**
     * Create a new team on the system.
     * https://api.mattermost.com/#tag/teams/paths/~1teams/post
     * @param name - Unique handler for a team, will be present in the team URL
     * @param displayName - Non-unique UI name for the team
     * @param type - 'O' for open (default), 'I' for invite only
     * All parameter required
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
     * All parameter required
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
     * Only teamId is required
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
     * Only teamId is required
     */
    apiAddUserToTeam(teamId: string, userId: string): Chainable<Response>;

    /**
     * Add a number of users to the team by user_id.
     * https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1members~1batch/post
     * @param teamId - Team ID
     * @param teamMembers - users to add as members of a team
     * Only teamId is required
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
     * Only userId is required
     */
    apiSaveUserPreference(
      preferences: Array<Preference> = [],
      userId: string = "me"
    ): Chainable<Response>;

    /**
     * Saves channel display mode preference of a user
     * @param value - Either "full" (default) or "centered"
     */
    apiSaveChannelDisplayModePreference(
      value: string = "full"
    ): Chainable<Response>;

    /**
     * Saves message display preference of a user
     * @param value - Either "clean" (default) or "compact"
     */
    apiSaveMessageDisplayPreference(
      value: string = "clean"
    ): Chainable<Response>;

    /**
     * Saves show markdown preview option preference of a user
     * @param value - Either "true" to show the options (default) or "false"
     */
    apiSaveShowMarkdownPreviewPreference(
      value: string = "true"
    ): Chainable<Response>;

    /**
     * Saves teammate name display preference of a user
     * @param value - Either "username" (default), "nickname_full_name" or "full_name"
     */
    apiSaveTeammateNameDisplayPreference(
      value: string = "username"
    ): Chainable<Response>;

    /**
     * Saves theme preference of a user
     * @param value - theme object.  Will pass default value if none is provided.
     */
    apiSaveThemePreference(value: Theme = {}): Chainable<Response>;

    /**
     * Saves theme preference of a user
     * @param value - sidebar settings object.  Will pass default value if none is provided.
     */
    apiSaveSidebarSettingPreference(
      value: SidebarSetting = {}
    ): Chainable<Response>;

    /**
     * Saves the preference on whether to show link previews
     * @param show - Either "true" to show link and images previews (default), or "false"
     */
    apiSaveShowPreviewPreference(show: string = "true"): Chainable<Response>;

    /**
     * Saves the preference on whether to expand/collapse image previews
     * @param collapse - Either "true" to show previews collapsed (default), or "false"
     */
    apiSavePreviewCollapsedPreference(collapse = "true"): Chainable<Response>;
  }
}
