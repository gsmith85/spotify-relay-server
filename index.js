'use strict';
const express = require('express');
const spotify = require('./spotify.js');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.get('/json', function (request, response) {
  return spotify.getPlaylist().then(function (data) {
    response.header("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    response.json(data);
  });
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
