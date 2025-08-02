if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const initData = require("./data.js");
const multer  = require('multer');
const cloudinary = require('cloudinary').v2;
const {storage} = require("../cloudConfig.js");
// const upload = multer({storage});


main().then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})


async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

const deleteImage =  ()=>{ cloudinary.api.delete_resources_by_prefix('wanderlust_dev/', function(error, result) {
  
  cloudinary.api.delete_folder('wanderlust_dev', function(err, res) {
    console.log('Deleted folder');
  });
})};


const uploadFromUrl = async (imageUrl) => {
    try{
  const res = await cloudinary.uploader.upload(imageUrl, { folder: 'wanderlust_dev'})
   return {url : res.secure_url,filename : res.public_id};
}catch (err) {
    console.error('Upload failed:', err);
  }
};

async function init(){
    deleteImage();
    await Review.deleteMany({});
    await Listing.deleteMany({});
     for (let listing of initData.data) {
     let uploadedImage = await uploadFromUrl(listing.image.url);
  const storedAddress = listing.location +","+ listing.country;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storedAddress)}`)
    .then(response => response.json())
    .then(res => {
       console.log([res[0].lat,res[0].lon]);
     listing.geoCoordinates = {
      coordinates : [res[0].lat,res[0].lon],
    };
    })
     listing.image = {
        url : uploadedImage.url,
        filename : uploadedImage.filename,
     } 
  }
     initData.data =  initData.data.map((obj) => ({...obj,owner : '687f7347418a580dd53d6310'}));
    let res = await Listing.insertMany(initData.data);
    console.log(res);
}

init();
// console.log("data is saved to db");
