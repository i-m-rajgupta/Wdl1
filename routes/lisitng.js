const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,validateErrorListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// In Express.js, a router is a way to modularize and organize your routes. It allows you to define
//  route handlers in separate files or modules, making your code cleaner and more manageable—especially
//  for large applications.

// In Express.js (Node.js framework), router.route() is a chained route handler method used to define 
// multiple HTTP methods for a single route in a cleaner and more readable way.

router.route("/")
       .get(wrapAsync (listingController.index))
       .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.post));

// New Route
router.get("/new",isLoggedIn,listingController.new)

router.route("/:id")
     .get(wrapAsync (listingController.show))
     .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateErrorListing,wrapAsync(listingController.update ))
     .delete(isLoggedIn,isOwner,wrapAsync( listingController.delete));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

module.exports = router;