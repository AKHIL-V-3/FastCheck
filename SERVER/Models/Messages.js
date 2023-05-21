const  mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const MessageSchema = new schema(
    {

       conversationId:{
           type:String
       },
       sender:{
        type:String
       },

       text:{
        type:String
       },


    
    },
    {
           timestamps:true
    }
)

module.exports = mongoose.model(Collections.MessageCollection,MessageSchema)