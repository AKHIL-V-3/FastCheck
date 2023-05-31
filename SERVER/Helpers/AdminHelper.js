

const bcrypt = require('bcrypt')


const Admin = require("../Models/AdminModel")
const User = require('../Models/UserModel')
const Host = require('../Models/HostModel')
const { ReservationSchema } = require('../Models/HotelModel');





module.exports = {


//     adminSignup: async (admin) => {

//         const salt = await bcrypt.genSalt();
//         admin.Password = await bcrypt.hash(admin.Password, salt)
         
//         admin.Email = admin.Email.trim(" ")
//         admin.Password = admin.Password.trim(" ")

//         return new Promise((resolve, reject) => {
//             Admin.create(admin).then((admin) => {
//                   resolve(admin)
//              })
//                   .catch((error) => {
//                        console.log(error.message);
//                        if (error.code === 11000) reject(new Error("Email  is already Registered"))
//                        else if (error.message.includes("Users validation failed")) reject(new Error("Valid User Name Required"))
//                        else reject()
//                   })
//         })

//    },

   adminLogin: (adminData) => {

        return new Promise(async (resolve, reject) => {
             const admin = await Admin.findOne({ Email: adminData.Email })
             if (admin) {
                  const auth = await bcrypt.compare(adminData.Password, admin.Password)
                  if (auth) {
                       resolve(admin)
                  } else {

                       reject(new Error("Incorrect Password"))

                  }
             } else {
                  reject(new Error("Incorrect Email"))
             }

        })
   },

   getAdmin:(adminId)=>{
      return new Promise((resolve, reject) => {
        Admin.findById(adminId, "-Password").then((response) => {
             resolve(response)
        })
             .catch((err) => {
                  reject(new Error(err))
             })
   })
   },

   getUserCount:()=>{
         return new Promise((resolve,reject)=>{
              User.find({}).count().then((count)=>{
                    resolve(count)   
              })
              .catch((err)=>{
                   reject(err)
              })
         })
   },
   getHostCount:()=>{
         return new Promise((resolve,reject)=>{
              Host.find({}).count().then((count)=>{
                    resolve(count)   
              })
              .catch((err)=>{
                   reject(err)
              })
         })
   },

   getBookingCount:()=>{
     return new Promise((resolve,reject)=>{
          ReservationSchema.find({}).count().then((count)=>{
                resolve(count)   
          })
          .catch((err)=>{
               reject(err)
          })
     })
}



}