

const Users = require("../Models/UserModel")
const Hotel = require("../Models/HotelModel")
const Host = require("../Models/HostModel")
const reservation = require("../Models/HotelModel")

var ObjectId = require('mongoose').Types.ObjectId;
const Collections = require("../Connections/Collections");
const { getRating } = require("../Controllers/ReviewController");



module.exports = {

    getAllHotels: () => {
        return new Promise(async(resolve, reject) => {
           const data = await Hotel.HotelSchema.aggregate([ 
                {
                     $lookup:{

                        from:"ratings",
                        localField:"_id",
                        foreignField:"hotelId",
                        as:"rating"
                     }
                },
                                
            ])
                    resolve(data)
            

        })

    },

    getHotelData: (hotelId) => {
        return new Promise(async (resolve, reject) => {
            const hotelDetails = await Hotel.HotelSchema.aggregate([
                {
                    $match: {
                        _id: new ObjectId(hotelId)
                    }
                },
                {
                    $lookup: {
                        from: 'hosts',
                        localField: "hostId",
                        foreignField: "_id",
                        as: "HostData"
                    }
                },
                {
                    $unwind:"$HostData"
                }
            ])
            if (hotelDetails) resolve(hotelDetails[0])
            else reject()
        })
    },

    reserveHotel:(reservationDetails)=>{
          return new Promise((resolve,reject)=>{
                reservation.ReservationSchema.create(reservationDetails).then((response)=>{
                        resolve(response)
                })
                .catch((error)=> reject())
          })   
    },

    updateHotelToBooked :(Reservation) => {
         const HotelId = Reservation?.HotelDetails?.HotelId
        const  Booking = {
            isBooked:true,
            checkIn:Reservation.BookingDetails.CheckIn,
            checkOut:Reservation.BookingDetails.CheckOut        
        }
          return new Promise((resolve,reject)=>{
                Hotel.HotelSchema.findByIdAndUpdate(HotelId,{Booking},{new:true}).then((response)=>{
                        resolve(response)
                })
                .catch((error)=> reject())
          })   
    },

    


    getUserReservations:(userId)=>{
          return new Promise((resolve,reject)=>{
               reservation.ReservationSchema.find({
                    $and:[
                        {"userDetails.userId" : new ObjectId(userId)},
                        {Booking:"Booked"}
                    ]
               }).then((response)=>{
                     resolve(response)
               })
               .catch((error)=>{
                console.log(error);
                   reject()
               })
          })
    },

    getFilteredReservation:(value,userId)=>{

          return new Promise(async(resolve,reject)=>{
            const response = await reservation.ReservationSchema.find({
                    $and:[
                        {"userDetails.userId" : new ObjectId(userId)},
                        {Booking:value}
                    ]
                })


            const All = await reservation.ReservationSchema.find({
                    $and:[
                        {"userDetails.userId" : new ObjectId(userId)},
                    ]
                })  
                if(value !== "All"){
                    resolve(response)
                }else{
                    resolve(All)
                }

          })
    },

    cancelReservation:(BookingId)=>{

          return new Promise((resolve,reject)=>{
                 reservation.ReservationSchema.findByIdAndUpdate(BookingId,{ Booking:"Canceled" },{new:true}).then((response)=>{
                       resolve(response)
                 })
                 .catch((err)=>{

                    reject()
                 })
          })
    },
    getUserImage:(userId)=>{
          return new Promise((resolve,reject)=>{
                Users.findById(userId).then((response)=>{
                    resolve(response)
                 })
                 .catch((err)=>{

                    reject()
                 })
          })
    }
}