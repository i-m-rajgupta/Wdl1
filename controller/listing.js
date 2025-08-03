const {cloudinary} = require("../cloudConfig.js");
const Listing = require("../models/listing.js");

// MVC (Model-View-Controller) is a design pattern used in web development to separate an application 
// into three interconnected components. This separation helps manage complexity, improve code reusability
// , and enable better organization, especially in larger applications.

// MVC divides an application into:

// Model:
// Represents the data and business logic
// Handles data storage and retrieval (e.g., from a database).
// Not concerned with user interface or presentation.

// View:

// Responsible for presenting data to the user (UI).
// Displays information from the model to the user.
// Passive: doesn’t change data or manage logic.

// Controller:
// Acts as an intermediary between the Model and the View.
// Receives input from the user via the View.
// Processes that input (e.g., validates, manipulates data) and updates the Model or View accordingly.

const deleteImage = (filename)=>{
try{
    cloudinary.uploader.destroy(filename, function(error, result) {
})
} catch(error) {
  console.log(error);
}
}

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
};
module.exports.new = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.post = async (req,res,next)=>{
    const storedAddress = req.body.listing.location +","+ req.body.listing.country;
    console.log(storedAddress);
  // Geocode using Nominatim API (OpenStreetMap)
    try{
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storedAddress)}`)
    .then(response => response.json())
    .then(dataMap => {
      if (dataMap.length > 0) {
    console.log(dataMap);
    let coordinates = [dataMap[0].lat,dataMap[0].lon];
          newListing["geoCoordinates"] = {
         coordinates : coordinates,
    }
      }catch(err){
          console.log(err);
      }
    let url = req.file.path;
    let filename = req.file.filename ;
    let newListing = req.body.listing ;
    newListing["image"] = {
        url : url,
        filename : filename,
    }
    let data = new Listing(newListing);
    data.owner = req.user._id ;
        let listing =  data.save().then(()=>{
         console.log(listing);
        req.flash("success"," New Listing added successfully ");
        res.redirect("/listings");
        })
      }else{
  req.flash("error"," Try again with precise location. ");
        res.redirect("/listings");
    }});
};

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path : "reviews",populate :{path : "author"}}).populate("owner");
     if(!data){
        req.flash("error","Listing you requested for doesn't exist.");
        res.redirect("/listings");
     } else {
    res.render("./listings/show.ejs",{data});
     }
};
module.exports.edit = async (req,res,next)=>{
    let {id} = req.params;
     let data = await Listing.findById(id);
    let originalUrl = data.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    if(!data){
        req.flash("error","Listing you requested for doesn't exist.");
        res.redirect("/listings");
     }else{
    res.render("./listings/edit.ejs",{data,originalUrl});
     }
};
module.exports.update = async (req,res,next)=>{
    let {id} = req.params;
    let listing = req.body.listing;
    let data = await Listing.findById(id);
    
    if(!data){
        req.flash("error","Listing you requested for doesn't exist.");
        return res.redirect("/listings");
    }
    
    if(listing.location != data.location || listing.country != data.country){
        const storedAddress = listing.location +","+ listing.country;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storedAddress)}`);
            const geoData = await response.json();
            if(geoData.length > 0) {
                listing.geoCoordinates = {
                    coordinates : [geoData[0].lat,geoData[0].lon],
                };
            }
        } catch(error) {
            console.log("Geocoding error:", error);
        }
    }
    
    data = await Listing.findByIdAndUpdate(id,{...listing},{new : true});
    
    if(req.file){
        deleteImage(data.image.filename);
        data["image"] = {
            url : req.file.path,
            filename : req.file.filename,
        }
        await data.save();
    }

    if(!data){
        return next(new ExpressError(400,"Bad Requests"));
    }
    
    req.flash("success"," Listing Updated successfully ");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res,next)=>{
    let {id} = req.params;
   let data = await Listing.findByIdAndDelete(id);
     deleteImage(data.image.filename);
    if(!data){
       return next(new ExpressError(400,"Bad Requests"));
     }
        req.flash("success","  Listing Deleted! ");
        res.redirect("/listings");
};
