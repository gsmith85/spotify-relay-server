import express from 'express';
import spotify from './spotify.mjs';

const app = express();
app.set('port', process.env.PORT || 5000);

app.get('/json', function (request, response) {
  return spotify.getPlaylist().then(function (data) {
    response.header(
      'Access-Control-Allow-Origin',
      process.env.ACCESS_CONTROL_ALLOW_ORIGIN
    );
    response.json(data);
  });
});

const server = app.listen(app.get('port'), function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
