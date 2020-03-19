// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const HEADERS = {'X-Requested-With': 'XMLHttpRequest'};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
};

const HTTP_METHOD = {
    DELETE: 'DELETE',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
};

module.exports = {
    HEADERS,
    HTTP_STATUS,
    HTTP_METHOD,
};