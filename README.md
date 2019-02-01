# Ac**cow**nt

_Dead simple user account system so easy a ~~caveman~~ **cow** could do it._

The goal of Accownt is to be a full-featured, standalone account system that's straightforward for developers and users, easy to mantain, and as customizable as possible without introducing too much complexity.

**Will it continue receiving updates?** Yes. It was built for and is mantained by [Ptorx](https://ptorx.com) and other projects in the [Xyfir Network](https://www.xyfir.com/network).

**What's it look like?** However you want it to, but for the default theme, see [Screenshots](#screenshots).

# Features

- Email login
  - Password optional!
- Two-Factory Authentication (2FA)
  - Authy, Google Authenticator, etc supported
  - Thanks to [speakeasy](https://www.npmjs.com/package/speakeasy)!
- Email verification
  - Plug in your SMTP credentials for Mailgun, Gmail, or anything else
  - Thanks to [nodemailer](https://www.npmjs.com/package/nodemailer)!
- Passwordless login
  - Emails with login links are sent on request
- Account recovery
  - Via passwordless login feature
- No dependencies other than Node and what npm will install
  - Older Node versions not actively supported
- No database needed
  - Users are simple JSON files stored to disk
  - Thanks to [node-persist](https://www.npmjs.com/package/node-persist)!
- Standalone server and web client
  - Easy integration into new and existing applications of any stack
- CAPTCHA support
  - Optional, just set your reCAPTCHA key
  - Thanks to [reCAPTCHA](https://www.google.com/recaptcha/)!
- JSON Web Tokens (JWT)
  - Shared JWT and cookie between Accownt and your app for session authentication
  - Thanks to [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)!
- Easy theming
  - Thanks to [Material-UI](https://material-ui.com/style/color/#color-tool)!

# Install

As simple as Accownt is, you'll still need to install, configure, build, and integrate into your app. We've made it just about as easy as it could possibly be.

**Note:** If your system does not yet have Node installed, start with [nvm](https://github.com/creationix/nvm#install-script) (or [nvm for Windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows)).

## Server

```bash
git clone git@github.com:Xyfir/Accownt.git
cd Accownt/server
npm install
cp constants/config.default.ts constants/config.ts
```

Now open up `Accownt/server/constants/config.ts` in your editor and fill out the values. Everything is explained there.

```bash
npm run build
npm run start # or launch ./dist/app.js however you like
```

At this point the setup is based on your environment and what your needs are. Probably you'll run the server with [pm2](https://www.npmjs.com/package/pm2) and put Node behind Nginx or Apache.

## Web Client

```bash
cd ../web
npm install
cp constants/config.default.js constants/config.js
```

Now open up `Accownt/web/constants/config.js` in your editor and fill out the values. Most will be the same as the server's config.

```bash
npm run build
```

## Integration Into Your App

This part is largely up to you, so it's important to understand the flow of data between your app and Accownt:

1. Your app sends users to Accownt's login/registration form either by user action or automatically through a forced redirection. All you need to do is get the user to Accownt, everything it needs to know is already in its config.
2. Accownt will handle everything until there's a login, at which point it will redirect the user back to your app with the JWT in the URL based on your configuration. The same JWT will _also_ be set as cookie to `jwt`, so depending on your setup you may be able to and prefer to access this instead.

To be a bit more specific:

1. Somewhere in your app you'll put login and/or registration links that point to the Accownt web client.
2. If your app utilizes the JWT cookie that Accownt sets (named `jwt`) then all you need to do is verify the token with each request via [jsonwebttoken](https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) or the equivalent in your preferred language.
3. Once the JWT is verified and decoded, you can retrieve the `userId` and `email` properties from it to use however you need. Note that `userId` is a unix timestamp in milliseconds (13 digits!) that corresponds to when the user created their account. Also keep in mind that if your app is receiving a JWT, the user's email has already been verified.
4. If the JWT is invalid or expired (they last 30 days), redirect them back to the Accownt form or to unauthenticated parts of your app.
5. Lastly, you'll need a route somewhere to catch redirections and tokens from Accownt after each successful login. You set this already in your config.
6. Optionally, you can also add a link somewhere that takes _authenticated_ users to Accownt so they can modify their account information, like their password or 2FA.

# Screenshots

<img src="https://i.imgur.com/eoN4kg1.png" alt="Login screenshot" height="400px" />

<img src="https://i.imgur.com/whIweGw.png" alt="Logged in screenshot" height="400px" />

<img src="https://i.imgur.com/CRgy0hQ.png" alt="Logged in screenshot" height="400px" />
