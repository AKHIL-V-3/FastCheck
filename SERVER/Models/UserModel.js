const  mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const userSchema = new schema({
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        lowercase:true,
        unique: true,
    },
    Password:{
        type:String,
        required:true
    },
    refreshToken:String,
    photoUrl:String,
    uid:String,
    personalInformation:Object
})

module.exports = mongoose.model(Collections.UserCollection,userSchema)