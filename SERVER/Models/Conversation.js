const  mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const ConversationSchema = new schema(
    {

        members:{
            type:Array,
            
        },

    
    },
    {
           timestamps:true
    }
)

module.exports = mongoose.model(Collections.ConversationCollection,ConversationSchema)