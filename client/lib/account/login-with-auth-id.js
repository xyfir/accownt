import request from 'superagent';

/**
 * Check if auth token linked to `userId` and `authId` has been verified.
 * Redirect to provided link if token has been verified.
 * @param {number} userId
 * @param {string} authId
 */
export default function(userId, authId) {
  // 10 minutes in the future
  const stopAfter = Date.now() + 60 * 10 * 1000;

  const interval = setInterval(
    () =>
      document.hasFocus() &&
      request
        .post('/api/login/auth-id')
        .send({
          userId,
          authId
        })
        .end((err, res) => {
          if (!err && !res.body.error) {
            clearInterval(interval);
            location.href = res.body.redirect;
          } else if (Date.now() >= stopAfter) {
            clearInterval(interval);
          }
        }),
    5000
  );
}
