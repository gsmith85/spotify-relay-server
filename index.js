'use strict';
const express = require('express');
const spotify = require('./spotify.js');

const app = express();

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.get('/json', function (request, response) {
  return spotify.getPlaylist().then(function (data) {
    response.json(data)
  });
});

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
