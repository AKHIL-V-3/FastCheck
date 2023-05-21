const mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema

const hostSchema = new schema({
   Hostname: {
      type: String,
      required: true
   },
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

module.exports = mongoose.model(Collections.HostCollection,hostSchema)

// module.exports = {
//    hostSchema: mongoose.model(Collections.HostCollection, hostSchema),
//    HotelSchema: mongoose.model(Collections.HotelCollection, HotelSchema)
// }