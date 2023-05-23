
const Host = require("../Models/HostModel")
const bcrypt = require('bcrypt')
const Hotel = require("../Models/HotelModel").HotelSchema
const Reservation = require("../Models/HotelModel").ReservationSchema
var ObjectId = require('mongoose').Types.ObjectId;



module.exports = {

     hostSignup: async (user) => {
          const salt = await bcrypt.genSalt();
          user.Password = await bcrypt.hash(user.Password, salt)
          let { Hostname, Email, Password } = user
          Hostname = Hostname.trim(" ")
          Email = Email.trim(" ")
          Password = Password.trim(" ")

          console.log(Hostname, Email, Password);
          return new Promise((resolve, reject) => {

               Host.create({ Hostname, Email, Password }).then((user) => {

                    resolve(user)
               })
                    .catch((error) => {

                         console.log(error.message);

                         if (error.code === 11000) reject(new Error("Email  is already Registered"))
                         else if (error.message.includes("Users validation failed")) reject(new Error("Valid User Name Required"))
                         else reject()
                    })
          })

     },

     hostLogin: (userData) => {
          return new Promise(async (resolve, reject) => {
               console.log(userData);
               const user = await Host.findOne({ Email: userData.Email })
               if (user) {
                    const auth = await bcrypt.compare(userData.Password, user.Password)
                    if (auth) {
                         resolve(user)
                    } else {
                         reject(new Error("Incorrect Password"))
                    }
               } else {
                    reject(new Error("Incorrect Email"))
               }
          })
     },

     addHotel: (HotelData) => {
          return new Promise((resolve, reject) => {
               Hotel.create(HotelData).then((res) => {
                    console.log(res);
                    resolve(res)
               })
                    .catch((err) => {
                         reject(err)
                    })
          })
     },

     getOneHotel:(hotelId)=>{

          return new Promise(async (resolve, reject) => {
               Hotel.find({_id:new ObjectId(hotelId)}).then((data) => {
                    if (data) resolve(data)
                    else reject()

               }).catch((err)=>{
                    console.log(err,'errrrr');
                    reject()
               })

          })


     },

     editHotel:(hotelData,hotelId)=>{
          const HotelId = new ObjectId(hotelId)
           return new Promise((resolve,reject)=>{
                 Hotel.findByIdAndUpdate(HotelId, hotelData , { new: true }).then((data)=>{
                       resolve(data)
                 })
                 .catch((err)=>{

                      reject()
                 })
           })  
     },

     getHotelData: (hostId) => {
          return new Promise(async (resolve, reject) => {
               Hotel.find({hostId:new ObjectId(hostId)}).then((data) => {
                    if (data) resolve(data)
                    else reject()

               }).catch((err)=>{
                    console.log(err,'errrrr');
                    reject()
               })

          })
     },

     getHost: (hostId) => {

          return new Promise((resolve, reject) => {

               Host.findById(hostId, "-Password").then((response) => {

                    resolve(response)
               })
                    .catch((err) => {

                         reject(new Error(err))
                    })
          })
     },

     removeHotel :(hotelId)=>{

            return new Promise((resolve,reject)=>{
                
                  Hotel.findByIdAndDelete(hotelId).then((response)=>{

                       resolve(response)
                  })
                  .catch((err)=>[

                      reject()
                  ])
            })
     },
     getAllreservations :(hostId)=>{
            return new Promise((resolve,reject)=>{
               Reservation.find({
                    $and:[
                         {"hostDetails.hostId" : new ObjectId(hostId)},
                         {Booking:"Booked"},   
                     ]
               }).then((response)=>{
                       resolve(response)
                  })
                  .catch((err)=>[
                      reject()
                  ])
            })
     },
     getPaymentHistory :(userId)=>{
            return new Promise((resolve,reject)=>{
               Reservation.find({
                    $and:[
                         {"userDetails.userId" : userId},
                         {paymentStatus:"paid"},   
                     ]
               }).then((response)=>{
                       resolve(response)
                  })
                  .catch((err)=>[
                      reject()
                  ])
            })
     }

}