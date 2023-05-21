
const Users = require("../Models/UserModel")

const bcrypt = require('bcrypt')


module.exports = {

     userSignup: async (user) => {
          const salt = await bcrypt.genSalt();
          user.Password = await bcrypt.hash(user.Password, salt)

          user.UserName = user.UserName.trim(" ")
          user.Email = user.Email.trim(" ")
          user.Password = user.Password.trim(" ")

          return new Promise((resolve, reject) => {
               Users.create(user).then((user) => {
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

     userLogin: (userData) => {

          return new Promise(async (resolve, reject) => {
               const user = await Users.findOne({ Email: userData.Email })
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

     addRefreshToken: (userId, refreshToken) => {

          return new Promise((resolve, reject) => {
               Users.findOneAndUpdate({ _id: userId }, { refreshToken: refreshToken }, { new: true }).then((User) => {

                    resolve(User)

               }).catch(() => {

                    reject()
               })
          })
     },

     getUser: async (userId) => {

          return new Promise((resolve, reject) => {

               Users.findById(userId, "-Password").then((response) => {

                    resolve(response)
               })
                    .catch((err) => {

                         reject(new Error(err))
                    })


          })

     },


     UploadUserImage :(userImage,userId)=>{

            return new Promise((resolve,reject)=>{

                 Users.findByIdAndUpdate(userId,{

                       photoUrl:userImage
                 })
                 .then((user)=>{

                       resolve(user)
                 })
                 .catch((err)=>reject())
            })
     },

     addUserInformation:(userData,userId)=>{

          return new Promise((resolve,reject)=>{

               Users.findByIdAndUpdate(userId,{

                     personalInformation:userData
               })
               .then((user)=>{

                    console.log(user);

                     resolve(user)
               })
               .catch((err)=>reject())
          })
     }





}