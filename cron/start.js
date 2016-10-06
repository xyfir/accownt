const cron = require("cron");

/*
    Set cronjobs to run at appropriate times
    Handle errors / responses from jobs
*/
module.exports = function() {
    
    const jobs = {
        deleteExpiredAccessTokens: require("./delete-expired-access-tokens")
    };

    // Delete access tokens over 3 days old
    // Runs every 6th hour
    // Retries once on failure
    new cron.CronJob("0 1/6 * * *", () => jobs.deleteExpiredAccessTokens(err => {
        if (err) jobs.deleteExpiredAccessTokens(err => { return; });
    }), () => { return; }, true);

};