'use strict';

const _ = require('lodash');
const request = require('request');
const q = require('q');


let ENCODED_CLIENT_AUTHENTICATION = (function base64EncodeClientIdAndSecret() {
    return new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
})();

// this is a deferred object
function genericJsonHttpHandler(error, response, body) {
    if (!error && response.statusCode == 200) {
        this.resolve(JSON.parse(body));
    } else {
        this.reject(error);
    }
}

let SPOTIFY_AUTHORIZATION_TOKEN_PROMISE =
    (function getAuthorizationToken () {
        const deferred = q.defer();

        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + ENCODED_CLIENT_AUTHENTICATION
            },
            form: 'grant_type=client_credentials', // adds Content-type: application/x-www-form-urlencoded like curl -d does
            method: 'POST'
        };

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
            url: process.env.PLAYLIST_URL
        });
    }
};
