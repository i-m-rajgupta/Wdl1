const Listing = require("../models/listing.js");
const Review = require("../models/review.js")

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    let res1 = await newReview.save();
    let res2 = await listing.save();
       req.flash("success"," New Review added successfully ");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing =await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    let del = await Review.findByIdAndDelete(reviewId);
       req.flash("success"," Review Deleted! ");
    res.redirect(`/listings/${id}`);
};