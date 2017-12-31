const path = require('path');
require('app-module-path').addPath(path.resolve(__dirname, '../'));

const sendMail = require('lib/email/send');
const MySQL = require('lib/mysql');

(async function() {

  const db = new MySQL;

  try {
    await db.getConnection();
    const users = await db.query(
      'SELECT id, email FROM users WHERE google = 1'
    );
    db.release();

    for (let user of users) {
      try {
        await sendMail({
          to: user.email,
          from: 'Xyfir Accounts <accounts@xyfir.com>',
          html: `
            <p><strong>Warning!</strong> Your Xyfir Account (<code>${user.email}</code>) was created via Google Sign-In. You must update your account before you lose access.</p>

            <p>Starting <strong>February 1st, 2018</strong>, Xyfir Accounts and all of the sites and applications it serves (Ptorx, xyBooks, xyAnnotations, etc) will no longer support Google Sign-In. This means that if you do not convert your account before that date you will lose access to your Xyfir Account and any of the sites linked to it.</p>

            <p>You can convert your Xyfir Account to a normal account by setting a password <a href="https://accounts.xyfir.com/#/dashboard/user/account">here</a>. You can login to your account via Google Sign-In until you set a password and from then on you will login using your email and password.</p>

            <p>If you have any questions or issues converting your account, you can <a href="https://xyfir.com/#/contact">contact support</a>.</p>
          `,
          subject: 'Removing Google Sign-In Support, Convert Your Account'
        });
      }
      catch (err) {
        console.error('Could not notify user', user.id);
      }
    }

    console.log('Job complete');
  }
  catch (err) {
    db.release();
    console.error('jobs/google', err);
  }

  process.exit(0);

})();