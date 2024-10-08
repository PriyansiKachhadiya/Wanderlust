const mongoose = require("mongoose");
const review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:
    {
        type :String,
        required:true
    },
    description:String,
    image:
    {
        filename: String, // Optional, if you're storing the file name
        url: {
            type: String,
            // default: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
            // set: (v) => v === "" ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9" : v
        }
  
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
         type: Schema.Types.ObjectId,
         ref:"Review"
        },
       
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },

    // geometry:{
    //     type:{
    //         type:String,
    //         enum:['Point'],
    //         required:true,
    //     }
    // },

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
   await review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;