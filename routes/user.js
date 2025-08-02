const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllerUser = require("../controller/user.js");

router.route("/signup")
.get(controllerUser.renderSignUp)
.post(wrapAsync(controllerUser.signUp));

router.route("/login")
.get(controllerUser.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true,
}),controllerUser.login)

router.get("/logout",controllerUser.logout);

module.exports = router;