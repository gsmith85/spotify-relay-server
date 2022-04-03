'use strict';

const _ = require('lodash');
const request = require('request');
const q = require('q');


const ENCODED_CLIENT_AUTHENTICATION = (function base64EncodeClientIdAndSecret() {
    return new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
})();

// this is a deferred object
function genericJsonHttpHandler(error, response, body) {
    if (!error && response.statusCode === 200) {
        this.resolve(body);
    } else {
        this.reject(error);
    }
}

const SPOTIFY_AUTHORIZATION_TOKEN_PROMISE =
    (function getAuthorizationToken () {
        // https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + ENCODED_CLIENT_AUTHENTICATION
            },
            form: {
                grant_type: 'client_credentials'
            },
            method: 'POST',
            json: true,
        };

        const deferred = q.defer();
        request(authOptions, _.bind(genericJsonHttpHandler, deferred));
        return deferred.promise;
    })();

function makeRequestAfterAuthenticationTokenResolves(options) {
    return SPOTIFY_AUTHORIZATION_TOKEN_PROMISE.then(function (authorizationTokenData) {
        const deferred = q.defer();
        const authorizationHeader = {
            headers: {
                'Authorization': 'Bearer ' + authorizationTokenData.access_token
            }
        };

        request(_.merge(options, authorizationHeader), _.bind(genericJsonHttpHandler, deferred));

        return deferred.promise;
    });
}

module.exports = {
    getPlaylist: function getPlaylist() {
        console.log(process.env.PLAYLIST_URL);
        return makeRequestAfterAuthenticationTokenResolves({
            url: 'https://api.spotify.com/v1/playlists/' + process.env.PLAYLIST_ID,
            json: true
        });
    }
};
