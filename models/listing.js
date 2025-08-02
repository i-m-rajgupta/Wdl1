const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;
const link = "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0…";


const listingSchema = Schema(
{
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
       url : String,
       filename : String,
    },
    price : {
        type : Number,
        required : true,
        min : 1
    },
    location : String ,
    country : String,
    reviews : [
      {
      type : Schema.Types.ObjectId,
      ref : "Review",
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
    geoCoordinates : {
      type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category : {
    type : String,
    enum : ["farms","trending","pools","mountain","mountain city","snow city"],
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing.reviews){
   let res = await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;