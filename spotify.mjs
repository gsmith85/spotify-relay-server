"use strict";

import fetch from "node-fetch";

const ENCODED_CLIENT_AUTHENTICATION =
  (function base64EncodeClientIdAndSecret() {
    return new Buffer(
      process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
    ).toString("base64");
  })();

const SPOTIFY_AUTHORIZATION_TOKEN_PROMISE = (function getAuthorizationToken() {
  // https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
  const formParameters = new URLSearchParams();
  formParameters.append("grant_type", "client_credentials");

  return fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      Authorization: "Basic " + ENCODED_CLIENT_AUTHENTICATION,
    },
    body: formParameters,
  }).then((j) => j.json());
})();

function makeRequestAfterAuthenticationTokenResolves(url) {
  return SPOTIFY_AUTHORIZATION_TOKEN_PROMISE.then(function (
    authorizationTokenData
  ) {
    return fetch(url, {
      headers: {
        Authorization: "Bearer " + authorizationTokenData.access_token,
      },
    }).then((j) => j.json());
  });
}

function getPlaylist() {
  return makeRequestAfterAuthenticationTokenResolves(
    "https://api.spotify.com/v1/playlists/" + process.env.PLAYLIST_ID
  );
}

export default { getPlaylist };
