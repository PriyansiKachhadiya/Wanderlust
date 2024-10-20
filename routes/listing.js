const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");

const upload = multer({ storage })
const {
  isLoggedIn,
  isOwner,
  validateListing,

} = require("../middleware.js");

const listingController = require("../controllers/listings.js")

router.route("/")
// Index route
.get(
  wrapAsync(listingController.index)
)
// create route
.post(
  isLoggedIn,

  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);
// filter route
router.get("/filter/:filter",
  wrapAsync(listingController.filterListing)
);
// search route
router.get("/search",
 wrapAsync(listingController.searchListing)
);

// New route
router.get(
  "/new",
  isLoggedIn,
listingController.renderNewForm
);

router.route("/:id")
// Show route
.get(
  wrapAsync(listingController.showListing)
)
// update route
.put(
  isLoggedIn,

  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
// delete route
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditform)
);


module.exports = router;





















