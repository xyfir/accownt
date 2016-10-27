const router = require('express').Router();

/* Dashboard - Account */
router.get("/dashboard/account", require("./dashboard/account/info"));
router.put("/dashboard/account", require("./dashboard/account/update"));

/* Dashboard - Ads */
router.get("/dashboard/ads", require("./dashboard/ads/info"));
router.put("/dashboard/ads", require("./dashboard/ads/update"));

/* Dashboard - Profiles */
router.get("/dashboard/profiles", require("./dashboard/profiles/get-all"));
router.post("/dashboard/profiles", require("./dashboard/profiles/create"));
router.get("/dashboard/profiles/:profile", require("./dashboard/profiles/get-single"));
router.put("/dashboard/profiles/:profile", require("./dashboard/profiles/update"));
router.delete("/dashboard/profiles/:profile", require("./dashboard/profiles/remove"));

/* Dashboard - Services */
router.get("/dashboard/services", require("./dashboard/services/get-all"));
router.get("/dashboard/services/:service", require("./dashboard/services/get-single"));
router.put("/dashboard/services/:service", require("./dashboard/services/update"));
router.delete("/dashboard/services/:service", require("./dashboard/services/remove"));

/* Dashboard - Security */
router.get("/dashboard/security", require("./dashboard/security/info"));
router.put("/dashboard/security/codes", require("./dashboard/security/codes"));
router.put("/dashboard/security/phone", require("./dashboard/security/phone"));
router.put("/dashboard/security/whitelist", require("./dashboard/security/whitelist"));
router.put("/dashboard/security/phone/verify", require("./dashboard/security/verify-phone"));
router.put("/dashboard/security/passwordless", require("./dashboard/security/passwordless"));

/* Dashboard - Tokens */
router.get("/dashboard/tokens", require("./dashboard/tokens/get"));
router.delete("/dashboard/tokens", require("./dashboard/tokens/delete"));

/* Login */
router.post("/login", require("./login/step-1"));
router.get("/login/logout", require("./login/logout"));
router.post("/login/verify", require("./login/step-2"));

/* Login - Misc */
router.get("/login/verify-email/:uid/:auth", require("./login/verify-email"));
router.get("/login/passwordless/:uid/:auth", require("./login/passwordless/"));
router.get("/login/passwordless/:email", require("./login/passwordless/send"));

/* Recover */
router.post("/recover", require("./recover/step-1"));
router.post("/recover/verify", require("./recover/step-2"));
router.get("/recover/:uid/:auth", require("./recover/"));

/* Register */
router.post("/register", require("./register/create-account"));
router.get("/register/email/:email", require("./register/check-email"));

/* Service - Dashboard */
router.get("/service/dashboard", require("./service/dashboard/get-all"));
router.post("/service/dashboard", require("./service/dashboard/create"));
router.put("/service/dashboard/:id", require("./service/dashboard/edit"));
router.delete("/service/dashboard/:id", require("./service/dashboard/remove"));
router.get("/service/dashboard/:id", require("./service/dashboard/get-single"));
router.post("/service/dashboard/:id/key", require("./service/dashboard/generate-key"));
router.delete("/service/dashboard/:id/key", require("./service/dashboard/delete-key"));

/* Service */
router.get("/service/:service", require("./service/info"));
router.post("/service/link/:service", require("./service/link-service"));
router.post("/service/session/:service", require("./service/create-session"));
router.get("/service/:service/:key/:xid/:token", require("./service/get-user"));

module.exports = router;