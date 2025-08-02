const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","You must be logged in .");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = ((req,res,next)=>{
    res.locals.redirectUrl = req.session.redirectUrl ;
    next();
})

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    let currUser = res.locals.currUser;
    if(!(currUser && currUser._id.equals(data.owner._id))){
       req.flash("error","You are not the owner of listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let data = await Review.findById(reviewId);
    let currUser = res.locals.currUser;
    if(!(currUser && currUser._id.equals(data.author._id))){
       req.flash("error","You are not the author of review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

// Form  validations - when we enter data in the form ,the browser and /or server will check that the data
// is in correct format and within the constraint set by the application 

module.exports.validateListing = (req,res,next)=>{
    console.log(req.body.listing);
    let {error} = listingSchema.validate(req.body.listing);
    if(error){
        throw new ExpressError(400,error);
    } else {
        next();
    }
}

module.exports.validateErrorListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }else {
        next();
    }
}