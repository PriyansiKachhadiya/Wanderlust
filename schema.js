const joi = require("joi");
const review = require("./models/review");
module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        filter: joi.string().valid('Trending', 'Rooms', 'Iconic cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Domes', 'Boats').required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.object().allow("",null)
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating:joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
})