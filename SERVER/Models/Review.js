const  mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const ReviewSchema = new schema(
    {
       userId:mongoose.Schema.Types.ObjectId,
       reviewtext:String,
       hotelId:String,
    
    },
    {
           timestamps:true
    }
)

module.exports = mongoose.model(Collections.ReviewCollection,ReviewSchema)