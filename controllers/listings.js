const Listing = require("../models/listing.js")
module.exports.index = async (req, res, next) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting ,searchedListing: null,filteredListing:null});
  };

module.exports.renderNewForm = (req, res, next) => {
  res.render("listings/new.ejs");
}  ;
module.exports.searchListing = async(req,res,next)=>{
  const searchquery = req.query.query;
  const searchedListing = await Listing.find({title: { $regex: `${searchquery}`, $options: 'i' }});
  res.render("listings/index.ejs", { searchedListing , alllisting: null ,filteredListing:null });
}

module.exports.filterListing = async(req,res,next)=>{
  const filter = req.params;
  const filteredListing = await Listing.find(filter);
  console.log(filteredListing);
  res.render("listings/index.ejs",{filteredListing,searchedListing:null,alllisting:null});
}

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = {url,filename};

  await newListing.save();
  req.flash("success", "New Listing Created!");
  return res.redirect("/listings");
};

module.exports.renderEditform = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested doesnt exists");
    return res.redirect("/listings");
  } else {
   let originalImageUrl =  listing.image.url ;
   originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250")
   res.render("listings/edit.ejs", { listing ,originalImageUrl});
  }
}

module.exports.updateListing = async (req, res, next) => {

  let { id } = req.params;
  const updatedData = { ...req.body.listing };
  console.log(updatedData);
  const listing=  await Listing.findByIdAndUpdate(id, updatedData); // Perform the update

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }

  req.flash("sucess", "you have sucessfully edited your listing");
 return res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("error", "Listing Deleted!");
 return res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesnt exists");
   return  res.redirect("/listings");
  } else {
    

    res.render("listings/show.ejs", {listing, newLocation:listing.location, });
  }
}

