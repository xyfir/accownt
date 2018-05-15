require('app-module-path').addPath(__dirname);

const SessionStore = require('express-mysql-session');
const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const config = require('config');
const admyn = require('admyn/server');
const MySQL = require('lib/mysql');
const app = express();

/* Serve Static Files */
app.use('/static', express.static(__dirname + '/static'));

/* Body-Parser */
app.use(parser.json({ limit: '2mb' }));
app.use(parser.urlencoded({ extended: true, limit: '2mb' }));

/* Sessions */
app.use(
  session({
    saveUninitialized: true,
    store: new SessionStore({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      useConnectionPooling: true
    }),
    secret: config.keys.session,
    resave: true,
    cookie: { httpOnly: false }
  })
);

/* Admyn */
app.use(
  '/admyn-DU9oF5p690ojUKdR3NYS',
  async function(req, res, next) {
    // Load `users.admin` where user id
    const db = new MySQL();
    await db.getConnection();
    const rows = await db.query('SELECT admin FROM users WHERE id = ?', [
      req.session.uid
    ]);
    db.release();

    if (!rows.length || !rows[0].admin) return res.status(403).send();
    req.admyn = { database: config.db };
    next();
  },
  admyn()
);

/* Express middleware / controllers */
app.use('/api', require('./middleware/clean-email'), require('./controllers/'));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/App.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/Redirect.html'));
app.get('/admin-DU9oF5p690ojUKdR3NYS', (req, res) =>
  res.sendFile(__dirname + '/views/Admin.html')
);

app.listen(config.environment.port, () => {
  console.log('Server running on port', config.environment.port);
});

if (config.environment.runCronJobs) require('jobs/cron/start')();
