require('app-module-path').addPath(__dirname);

const cookieParser = require('cookie-parser');
const express = require('express');
const parser = require('body-parser');
const config = require('config');
const jwt = require('middleware/jwt');
const app = express();

app.use('/static', express.static(__dirname + '/static'));
app.use(parser.urlencoded({ extended: true, limit: '2mb' }));
app.use(parser.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(jwt);
app.use('/api', require('./middleware/clean-email'), require('./controllers/'));
app.get('/*', (req, res) => res.sendFile(__dirname + '/views/App.html'));

app.listen(config.environment.port, () =>
  console.log('Listening on', config.environment.port)
);

if (config.environment.runCronJobs) require('jobs/cron/start')();
