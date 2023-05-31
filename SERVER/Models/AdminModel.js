const mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const AdminSchema = new schema({
    
   Email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
   },
   Password: {
      type: String,
      required: true
   },
   refreshToken: String
})

module.exports = mongoose.model(Collections.AdminCollection,AdminSchema)