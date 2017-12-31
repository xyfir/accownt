const deleteExpiredAccessTokens =
  require('jobs/cron/delete-expired-access-tokens');

module.exports = function() {

  // Runs every 4 hours
  setInterval(() => deleteExpiredAccessTokens(), 14400 * 1000);

};