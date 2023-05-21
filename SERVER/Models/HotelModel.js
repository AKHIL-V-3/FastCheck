const mongoose = require("mongoose")
const Collections = require("../Connections/Collections")
const schema = mongoose.Schema


const HotelSchema = new schema({

   HotelName: {
      type: String,
      required: true
   },
   NumberofRooms: {
      type: Number,
      required: true
   },
   RoomType:{
      type: String,
      required: true
   },
   HotelAddress: {
      type: Object,
      required: true
   },
   Price: {
      type: Number,
      require: true
   },
   hostId: {
      type: mongoose.Schema.Types.ObjectId,
   },
   HotelFacilities: {
      amenities: Object,
      safety: Object
   },
   HotelImages: [String],
   RoomImages: [String],
   rating:Number,

   Booking:{
      type:Object,
      default:{
         isBooked:false,
         checkIn:null,
         checkOut:null
      }
   }

})


const ReservationSchema = new schema({

   BookingDetails: {
      CheckIn: Date,
      CheckOut: Date,
      NumberOfNights: Number,
      TotalGusts: Number,
      numberOfAdults: Number,
      numberOfChildren: Number,
      numberOfInfants: Number,
      totalCost: Number
   },

   hostDetails: {
      hostId: mongoose.Schema.Types.ObjectId,
      hostName: String,
      Email: String,
   },
   userDetails: {
      userName: String,
      userId: mongoose.Schema.Types.ObjectId,
      userEmail: String
   },

   HotelDetails:{

      HotelName:String,
      HotelId:mongoose.Schema.Types.ObjectId,
      HotelAddress:String,
      HotelImage:String,

  },

   customerId: String,
   customerEmail: String,
   custometName: String,
   country: String,
   currency: String,
   paymentMethod: String,
   paymentStatus: String,
   SubTotal: Number,
   Total: Number,
   Booking:String,
   
})

module.exports = {
   ReservationSchema: mongoose.model(Collections.ReservationCollection, ReservationSchema),
   HotelSchema: mongoose.model(Collections.HotelCollection, HotelSchema)
}