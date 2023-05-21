const  mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const ratingSchema = new schema(
    {
       userId:mongoose.Schema.Types.ObjectId,
       rating:Number,
       hotelId:String,
    
    },
    {
           timestamps:true
    }
)

module.exports = mongoose.model(Collections.ratingCollection,ratingSchema)