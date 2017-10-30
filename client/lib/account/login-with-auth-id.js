import request from 'superagent';

/**
 * Check if auth token linked to `userId` and `authId` has been verified. 
 * Redirect to provided link if token has been verified.
 * @param {number} userId
 * @param {string} authId
 */
export default function(userId, authId) {

 let tries = 0;

 const interval = setInterval(() => request
   .post('/api/login/auth-id')
   .send({
     userId, authId
   })
   .end((err, res) => {
     if (!err && !res.body.error) {
       clearInterval(interval);
       location.href = res.body.redirect;
     }
     else if (++tries >= 85) {
       clearInterval(interval);
     }
   })
 , 7000);

}