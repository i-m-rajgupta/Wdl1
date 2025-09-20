if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("./models/listing.js");

const listingRouter = require("./routes/lisitng.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const User = require("./models/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs",ejsMate);

main().then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret :  process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error",()=>{
    console.log("Error in MONGO_URL",err);
})

const sessionOption = {
    store,
    secret :  process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
    expires : Date.now() + 7*24*60*60*1000 ,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
})

// app.get("/demo", async (req,res)=>{
//     let fakeUser = {
//         email : "student@gmail.com",
//         username : "Studentioo",
//     }
//     let registeredUser = await User.register(fakeUser,"password");
//      res.send(registeredUser); 
// })

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.post("/search",async(req,res,next)=>{
    const query = req.body.search;
    if(!query){
        res.redirect("/listings")
    }
      try {
    const allListings = await Listing.find({
          $or: [
             { country: { $regex: query, $options: "i" } },
               { location: { $regex: query, $options: "i" } },
        { title : { $regex: query, $options: "i" } },
      ]
    })
    if(allListings.length>0){
     res.render("./listings/index.ejs",{allListings});
    }else{
        req.flash("error","No Results found for this query !!");
        res.redirect("/listings");
    }
} catch (err) {
   req.flash("error","No Results found for this query !!");
   res.redirect("/listings");
  }
});
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Some error has occured!!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

const port = process.env.PORT || 3000;
app.listen(port,(req,res)=>{
    console.log("App is listening..");
});