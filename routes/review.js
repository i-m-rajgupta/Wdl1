const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isAuthor} = require("../middleware.js");
const controllerReview = require("../controller/review.js");

// Reviews 
// Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync (controllerReview.createReview));

// Review delete route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(controllerReview.deleteReview));

module.exports = router;