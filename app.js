if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust" ;
const dbUrl = process.env.ATLASDB_URL;
const method_override = require("method-override");
const ejs_mate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js")


async function main() {
  await mongoose.connect(mongo_url);
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
  const store = MongoStore.create({
    mongoUrl:mongo_url,
    crypto:{
     secret: process.env.SECRET
    },
    touchAfter:24*3600,
  
  })
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
store.on("error",()=>{
  console.log("error in mongo session store");s
})


app.engine("ejs", ejs_mate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.success);
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeuser = new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   })
//   let registerd = await User.register(fakeuser,"helloworld");
//   res.send(registerd);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // If headers are already sent, delegate to Express's built-in error handler
  }
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
