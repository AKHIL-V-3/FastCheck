

var jwt = require('jsonwebtoken');
const Users = require("../Models/HostModel")
const userHelper = require('../Helpers/AuthHelper');
const cookie = require('cookie'); 
const HostHelpers = require('../Helpers/HostHelpers');
const { response } = require('express');
const { uploadmultipleImages } = require('../Connections/uploadImages');
var ObjectId = require('mongoose').Types.ObjectId;
 
const jwtSecret = "JsonWebAccessTokenSecretkeyhost"
const HostToken = "hostAccessToken"
const HostRefresh = "hostRefreshToken"


const handleErrors = (err) => {

    let errors = { email: "", password: "", username: "" }

    console.log(err);

    if (err.message === "Incorrect Email") {
        errors.email = "The Email is not Registered"
        return errors
    }

    if (err.message === "Incorrect Password") {
        errors.password = "The Password is Incorrect"
        return errors
    }

    if (err.message === "Email  is already Registered") {
        errors.email = "Email is already registered"
        return errors
    }
    if (err.message === "Valid User Name Required") {
        errors.username = "Valid User Name required"
        return errors
    }


    if (err.message.includes("Users validation failed")) {

        Objects.values(err.errors).forEach(({ properties }) => {

            errors[properties.path] = properties.message
        })
    }

    return errors


}


module.exports={

    hostHome:async(req,res)=>{     
           
            const hostId = req.hostId 
            HostHelpers.getHost(hostId).then((host)=>{
                  if(!host){
                      return res.status(404).json({message:"host not found"})
                  }
                  res.status(200).json({host})
            })
          
    },
 
    getHoteldata:(req,res)=>{
        const hostId = req.hostId
        HostHelpers.getHotelData(hostId).then((response)=>{
            res.status(200).json(response)    
        })
        .catch((err)=>{
            res.status(500).json({message:"couldn't get the hotel data"})
        })
    },

    hostSignup:async(req,res)=>{
        try {
            HostHelpers.hostSignup(req.body).then((user) => {
                res.status(201).json({ user: user, created: true,})
            })
                .catch((error) => {
                    const errors = handleErrors(error)
                    res.json({ errors, created: false })
                })
        } catch (error) {
            console.log(error, 'catcherrrorr');
            const errors = handleErrors(error)
            res.status(403).json({ errors, created: false })
        }   
    },

    hostLogin:(req,res)=>{
        try {
            HostHelpers.hostLogin(req.body).then((user) => {

                const accessToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRETHOST, { expiresIn: "60m" })
                const refreshToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRETHOST, { expiresIn: "30d" })
                if (req.cookies[process.env.HOST_TOKEN]) {
                    req.cookies[process.env.HOST_TOKEN] = "";
                }

                if (req.cookies[process.env.HOST_REFRESH]) {
                    req.cookies[process.env.HOST_REFRESH    ] = "";
                }


                res.cookie(process.env.HOST_TOKEN, accessToken, {
                    path: '/host',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    httpOnly: true,
                    sameSite: "lax",
                })
                res.cookie(process.env.HOST_REFRESH, refreshToken, {
                    path: '/host',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                })  
                return res.status(200).send({ user: user, created: true, accessToken: accessToken })     
            })
                .catch((error) => {
                    const errors = handleErrors(error)
                    res.json({ errors, created: false })
                })
        } catch (error) {
            console.log(error);
        }
    },

    verifyHost:(req,res,next)=>{
        try {
            const token = req.cookies.hostAccessToken
            if (!token) {
                res.status(401).json({ message: "NO token found" })
            } else {
                jwt.verify(String(token), process.env.ACCESSTOKEN_SECRETHOST, (err, user) => {
                    if (err) {
                        res.status(401).json({ message: "unAutharized token" })
                    } else {
                        req.hostId = user.id
                        next()
                    }
                })
            }

        } catch (error) {

            console.log(error);
            console.log(error.name);
        }
},

refreshTokenHost :(req,res,next)=>{

    const prevtoken = req.cookies.hostRefreshToken
    if (!prevtoken) {
        return res.status(400).json({ message: "couldn't find token" })
    }
    jwt.verify(String(prevtoken), process.env.ACCESSTOKEN_SECRETHOST, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Authentication failed" })
        }
        const token = jwt.sign({ id: user.id }, process.env.ACCESSTOKEN_SECRETHOST, {
            expiresIn: "60m"
        })
        res.cookie(HostToken, token, {
            path: '/host',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            httpOnly: true,
            sameSite: "lax",
        })
        req.hostId = user.id
        next()
    })


},

addHotel:async (req,res)=>{
    const hostId = req.hostId
    req.body.hostId = new ObjectId(hostId)
    HostHelpers.addHotel(req.body).then((response)=>{
           console.log(response);     
           res.status(200).json({message:"Hotel Added"})
    })
    .catch((error)=>{
          console.log(error);
    })
},


getOneHotel:(req,res)=>{
    const hotelId = req.params.hotelId 
    HostHelpers.getOneHotel(hotelId).then((response)=>{
        res.status(200).json({response})        
    })
    .catch((error)=>{
        res.status(500).json({message:"failed"})         
    })    
},

editHotel:(req,res)=>{
    const hotelId = req.params.hotelId 
    HostHelpers.editHotel(req.body,hotelId).then((response)=>{
         res.status(200).json({response})
    })
    .catch((error)=>{
         res.status(500).json({message:"failed"})
    })   
},


logOut:(req,res)=>{
   res.clearCookie(`${HostToken}`)
   req.cookies[`${HostToken}`] = "";
   res.clearCookie(`${HostRefresh}`)
   req.cookies[`${HostRefresh}`] = "";
   res.status(200).json({ message: "Successfully Logged Out" })
},


removeHotel:(req,res)=>{
       const hotelId = req.params.hotelId  
       HostHelpers.removeHotel(hotelId).then((response)=>{
           res.status(200).json({message:"successfully deleted"})
       })
       .catch((err)=> {
        console.log(err)
        res.status(403).json({message:"something wrong"})
       })
},

getAllreservations:(req,res)=>{
    const hostId = req.params.hostId 
       HostHelpers.getAllreservations(hostId).then((response)=>{
           res.status(200).json(response)
       })
       .catch((err)=> {
        console.log(err)
        res.status(403).json({message:"something wrong"})
       })
},
getPaymentHistory:(req,res)=>{
    const userId = req.params.userId 
       HostHelpers.getPaymentHistory(userId).then((response)=>{
           res.status(200).json(response)
       })
       .catch((err)=> {
        console.log(err)
        res.status(403).json({message:"something wrong"})
       })
}







}