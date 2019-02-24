# Ac**cow**nt

_Dead simple user account system so easy a ~~caveman~~ **cow** could do it._

The goal of Accownt is to be a full-featured, standalone account system that's straightforward for developers and users, easy to mantain, and as customizable as possible without introducing too much complexity.

**Will it continue receiving updates?** Yes. It was built for and is mantained by [Ptorx](https://ptorx.com) and other projects in the [Xyfir Network](https://www.xyfir.com/network).

**What's it look like?** However you want it to, but for the default theme, see [Screenshots](#screenshots).

# Features

- Email + password login
  - Passwords are optional
  - Passwords are hashed thanks to [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- Two-Factor Authentication (2FA)
  - Authy, Google Authenticator, etc supported
  - Thanks to [speakeasy](https://www.npmjs.com/package/speakeasy)
- Email verification
  - Plug in your SMTP credentials for Mailgun, Gmail, or anything else
  - Thanks to [nodemailer](https://www.npmjs.com/package/nodemailer)
- Passwordless login
  - Emails with login links are sent on request
- Account recovery
  - Via passwordless login feature
- No dependencies other than Node and what npm will install
  - Older Node versions not actively supported
- No database needed
  - Users are simple JSON files stored to disk
  - Thanks to [node-persist](https://www.npmjs.com/package/node-persist)
- Standalone server and web client
  - Easy integration into new and existing applications of any stack
- CAPTCHA support
  - Optional, just set your reCAPTCHA key
  - Thanks to [reCAPTCHA](https://www.google.com/recaptcha/)
- JSON Web Tokens (JWT)
  - Shared JWT and cookie between Accownt and your app for session authentication
  - Thanks to [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Easy theming
  - Thanks to [Material-UI](https://material-ui.com/style/color/#color-tool)

# Install

As simple as Accownt is, you'll still need to install, configure, build, and integrate into your app. We've made it just about as easy as it could possibly be.

**Note #1:** If your system does not yet have Node installed, start with [nvm](https://github.com/creationix/nvm#install-script) (or [nvm for Windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows)).

**Note #2:** You may alternatively download Accownt through npm (see [here](http://npmjs.com/package/accownt)), however this is not currently the recommended installation method. In the future we'll likely have a CLI tool available through npm to make configuring, running, and managing Accownt instances easier.

## Server

```bash
git clone https://github.com/Xyfir/accownt.git
cd accownt/server
npm install
touch .env
```

Now open up `accownt/server/.env` in your editor and fill out the values. See the `Accownt.Env.Common` and `Accownt.Env.Server` interfaces in [types/accownt.d.ts](https://github.com/Xyfir/accownt/blob/master/types/accownt.d.ts) for expected environment variables. Format is `KEY=VALUE` (`PROD=true`, `NAME="Accownt"`, etc).

```bash
npm run build
npm run start # or launch ./dist/app.js however you like
```

At this point the setup is based on your environment and what your needs are. Probably you'll run the server with [pm2](https://www.npmjs.com/package/pm2) and put Node behind Nginx or Apache.

## Web Client

```bash
cd ../web
npm install
touch .env
```

Now open up `accownt/server/.env` in your editor and fill out the values. See the `Accownt.Env.Common` and `Accownt.Env.Web` interfaces in [types/accownt.d.ts](https://github.com/Xyfir/accownt/blob/master/types/accownt.d.ts) for expected environment variables.

```bash
npm run build
```

## Integration Into Your App

This part is largely up to you, so it's important to understand the flow of data between your app and Accownt:

1. Your app sends users to Accownt's login/registration form either by user action or automatically through a forced redirection. All you need to do is get the user to Accownt, everything it needs to know is already in its config.
2. Accownt will handle everything until there's a login, at which point it will redirect the user back to your app with the JWT in the URL based on your configuration. The same JWT will _also_ be set as a cookie, so depending on your setup you may be able to and prefer to access this instead.

To be a bit more specific:

1. Somewhere in your app you'll put login and/or registration links that point to the Accownt web client.
2. If your app utilizes the JWT cookie that Accownt sets then all you need to do is verify the token with each request via [jsonwebttoken](https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) or the equivalent in your preferred language.
3. Once the JWT is verified and decoded, you can retrieve the `userId` and `email` properties from it to use however you need. Note that `userId` is a unix timestamp in milliseconds (13 digits!) that corresponds to when the user created their account. Also keep in mind that if your app is receiving a JWT, the user's email has already been verified.
4. If the JWT is invalid or expired, redirect them back to the Accownt form or to unauthenticated parts of your app.
5. Lastly, you'll need a route somewhere to catch redirections and tokens from Accownt after each successful login. You set this already in your config.
6. Optionally, you can also add a link somewhere that takes _authenticated_ users to Accownt so they can modify their account information, like their password or 2FA.

## Docker

Docker support is currently being added. You should use the Dockerfiles within the server and web directories to run containers using the .env files. See the docker-compose.yml for a (development environment) example.

# Screenshots

<img src="https://i.imgur.com/eoN4kg1.png" alt="Login screenshot" height="400px" />

<img src="https://i.imgur.com/whIweGw.png" alt="Logged in screenshot" height="400px" />

<img src="https://i.imgur.com/CRgy0hQ.png" alt="Logged in screenshot" height="400px" />
