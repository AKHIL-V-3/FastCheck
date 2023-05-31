var jwt = require('jsonwebtoken');
const Admin = require("../Helpers/AdminHelper");
require('dotenv').config()


const handleErrors = (err) => {

    console.log(err.message);

    let errors = { email: "", password: "" }
    
    if (err.message === "Incorrect Password") {
        errors.password = "Email or Password is Incorrect"
        return errors
    }
    if (err.message === "Incorrect Email") {
        errors.password = "Email or Password is Incorrect"
        return errors
    }
    if (err.message.includes("Users validation failed")) {
        Objects.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}



module.exports = {


       Dashboard:(req,res)=>{
        const adminId = req.id
        if (adminId) {
            Admin.getAdmin(adminId).then((admin) => {
                if (!admin) {
                    res.status(404).json({ messagae: "user not found" })
                } else {
                    res.status(200).json(admin)
                }
            })
        }  
       },

    //    adminSignup:(req,res)=>{

    //     try {
    //         Admin.adminSignup(req.body).then((admin) => {
    //             res.status(201).json({ admin: admin, created: true, })
    //         })
    //             .catch((error) => {
    //                 const errors = handleErrors(error)
    //                 res.json({ errors, created: false })
    //             })
    //     } catch (error) {
    //         const errors = handleErrors(error)
    //         res.status(403).json({ errors, created: false })
    //     }

    //    },

       adminLogin:(req,res)=>{

        try {
            Admin.adminLogin(req.body).then((user) => {
                const accessToken = jwt.sign({ id: user._id }, process.env.ADMIN_ACCESSTOKEN_SECRET, { expiresIn: "60m" })
                const refreshToken = jwt.sign({ id: user._id }, process.env.ADMIN_ACCESSTOKEN_SECRET, { expiresIn: "365d" })
                if (req.cookies[process.env.ADMIN_TOKEN]) {
                    req.cookies[process.env.ADMIN_TOKEN] = "";
                }

                if (req.cookies[process.env.ADMIN_REFRESH]) {
                    req.cookies[process.env.ADMIN_REFRESH] = "";
                }

                res.cookie(process.env.ADMIN_TOKEN, accessToken, {
                    path: '/admin',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
                    httpOnly: true,
                    sameSite: "lax",
                })
                res.cookie(process.env.ADMIN_REFRESH, refreshToken, {
                    path: '/admin',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                })

                return res.status(200).json({ user, created: true, accessToken: accessToken })
            })
                .catch((error) => {
                    const errors = handleErrors(error)
                    res.json({ errors, created: false })
                })
        } catch (error) {
            console.log(error.message);
        }
       },

       verifyAdminToken: (req, res, next) => {
        try {
            const token = req.cookies.adminAccessToken

            if (!token) {
                res.status(401).json({ message: "NO token found" })
            } else {
                jwt.verify(String(token), process.env.ADMIN_ACCESSTOKEN_SECRET, (err, user) => {
                    if (err) {
                        res.status(401).json({ message: "unAutharized token" })
                    } else {
                        req.id = user.id
                        next()
                    }
                })
            }

        } catch (error) {
            console.log(error);
            console.log(error.name);

        }
    },

    logOut:(req,res)=>{

         res.clearCookie(`${process.env.ADMIN_TOKEN}`)
         req.cookies[`${process.env.ADMIN_TOKEN}`] = "";
         res.clearCookie(`${process.env.ADMIN_REFRESH}`)
         req.cookies[`${process.env.ADMIN_REFRESH}`] = "";
         res.status(200).json({ message: "Successfully Logged Out" })
         
    },

    getUserCount:(req,res)=>{
            try{
                 Admin.getUserCount().then((userCount)=>{
                    res.status(200).json({userCount})
                 })
                 .catch((err)=>{
                    console.log(err);
                      res.status(500).json({message:"Failed to get Count"})
                 })

            }catch(err){
                console.log(err);
            }
    },

    getHostCount:(req,res)=>{
            try{
                 Admin.getHostCount().then((hostCount)=>{
                    res.status(200).json({hostCount})
                 })
                 .catch((err)=>{
                    console.log(err);
                      res.status(500).json({message:"Failed to get Count"})
                 })
            }catch(err){
                console.log(err);
            }
    },
    getBookingCount:(req,res)=>{
            try{
                 Admin.getBookingCount().then((bookingCount)=>{
                    res.status(200).json({bookingCount})
                 })
                 .catch((err)=>{
                    console.log(err);
                      res.status(500).json({message:"Failed to get Count"})
                 })
            }catch(err){
                console.log(err);
            }
    },



}