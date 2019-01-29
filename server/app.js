require('app-module-path').addPath(__dirname);

const SessionStore = require('express-mysql-session');
const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const config = require('config');
const app = express();

app.use('/static', express.static(__dirname + '/static'));
app.use(parser.json({ limit: '2mb' }));
app.use(parser.urlencoded({ extended: true, limit: '2mb' }));
app.use(
  session({
    saveUninitialized: true,
    store: new SessionStore(config.db),
    secret: config.keys.session,
    resave: true,
    cookie: { httpOnly: false }
  })
);
app.use('/api', require('./middleware/clean-email'), require('./controllers/'));
app.get('/*', (req, res) => res.sendFile(__dirname + '/views/App.html'));

app.listen(config.environment.port, () =>
  console.log('Listening on', config.environment.port)
);

if (config.environment.runCronJobs) require('jobs/cron/start')();
