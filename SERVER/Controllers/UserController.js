
var jwt = require('jsonwebtoken');
const userHelper = require('../Helpers/AuthHelper');
const User = require("../Helpers/UserHelper")
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)


const handleErrors = (err) => {

    let errors = { email: "", password: "", username: "" }
    if (err.message === "Incorrect Email") {
        errors.email = "Please sign up for continue using our service."
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

module.exports = {

    Home: (req, res, next) => {
        const userId = req.id
        if (userId) {
            userHelper.getUser(userId).then((user) => {
                if (!user) {
                    res.status(404).json({ messagae: "user not found" })
                } else {
                    res.status(200).json({ user })
                }
            })
        }
    },

    verifyToken: (req, res, next) => {

        try {
            const token = req.cookies.userAccessToken
            if (!token) {
                res.status(401).json({ message: "NO token found" })
            } else {
                jwt.verify(String(token), process.env.ACCESSTOKEN_SECRET, (err, user) => {
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

    userSignup: async (req, res) => {
        try {
            userHelper.userSignup(req.body).then((user) => {
                res.status(201).json({ user: user, created: true, })
            })
                .catch((error) => {
                    const errors = handleErrors(error)
                    res.json({ errors, created: false })
                })
        } catch (error) {
            const errors = handleErrors(error)
            res.status(403).json({ errors, created: false })
        }
    },

    userLogin: (req, res) => {

        try {
            userHelper.userLogin(req.body).then((user) => {
                const accessToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, { expiresIn: "59m" })
                const refreshToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, { expiresIn: "1y" })
                if (req.cookies[`${process.env.USER_TOKEN}`]) {
                    req.cookies[`${process.env.USER_TOKEN}`] = "";
                }
                res.cookie(process.env.USER_TOKEN, accessToken, {
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    httpOnly: true,
                    sameSite: "lax",
                })
                res.cookie(process.env.USER_REFRESH, refreshToken, {
                    path: '/',
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

    refreshToken: (req, res, next) => {

        const prevtoken = req.cookies.process.env.USER_REFRESH

        console.log(prevtoken);
        if (!prevtoken) {
            return res.status(400).json({ message: "couldn't find token" })
        }
        jwt.verify(String(prevtoken), process.env.ACCESSTOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Authentication failed" })
            }
            const token = jwt.sign({ id: user.id }, process.env.ACCESSTOKEN_SECRET, {

                expiresIn: "59m"
            })
            res.cookie(process.env.USER_TOKEN, token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: true,
                sameSite: "lax",
            })
            req.id = user.id
            next()
        })
    },

    logOut: (req, res) => {


        res.clearCookie(`${process.env.USER_TOKEN}`)
        req.cookies[`${process.env.USER_TOKEN}`] = "";
        res.clearCookie(`${process.env.USER_REFRESH}`)
        req.cookies[`${process.env.USER_REFRESH}`] = "";

        res.status(200).json({ message: "Successfully Logged Out" })

    },

    userProfile: (req, res) => {

        try {
            const userId = req.id
            if (userId) {
                userHelper.getUser(userId).then((user) => {
                    if (!user) {
                        return res.status(404).json({ messagae: "user not found" })
                    } else {
                        return res.status(200).json({ user })
                    }
                })
            } else {
                res.status(404).json({ message: "user not found" })
            }
        }
        catch (error) {
            console.log(error);
        }
    },

    uploadUserImage: (req, res) => {

        const userId = req.id
        const userImage = req.body.userImage
        userHelper.UploadUserImage(userImage, userId).then((response) => {
            res.status(200).json({ response })
        })
            .catch((err) => res.status(500).json({ message: "upation failed" }))
    },

    adduserInformation: (req, res) => {
        
        const userId = req.id
        userHelper.addUserInformation(req.body, userId).then((response) => {
            res.status(200).json({ response })
        })
            .catch((err) => {
                res.status(500).json({ message: "failed to add userInfo" })
            })
    },

    getAllHotels: (req, res) => {
        User.getAllHotels().then((response) => {
            res.status(200).json({ response })
        })
            .catch((error) => res.status(500).json({ message: "For get the hotel request is failed" }))
    },

    getHotelData: (req, res) => {
        const hotelId = req.params.hotelId
        User.getHotelData(hotelId).then((response) => {
            res.status(200).json({ response })
        })
            .catch((err) => res.status(500).json({ messagae: "couldn't get the hotel data" }))
    },

    HotelBook: async (req, res) => {

        const { totalCost, } = req.body
        const userId = req.id
        const user = await userHelper.getUser(userId)
        try {
            const customer = await stripe.customers.create({
                metadata: {
                    email: user.Email,
                    name: user.UserName,
                    CheckIn: req.body.CheckIn,
                    CheckOut: req.body.CheckOut,
                    NumberOfNights: req.body.numberOfNights,
                    TotalGusts: req.body.TotalGusts,
                    numberOfAdults: req.body.numberOfAdults,
                    numberOfChildren: req.body.numberOfChildren,
                    numberOfInfants: req.body.numberOfInfants,
                    totalCost: req.body.totalCost,
                    hostId: req.body.HotelDetails.HostData._id,
                    hostName: req.body.HotelDetails.HostData.Hostname,
                    Email: req.body.HotelDetails.HostData.Email,
                    userName: user.UserName,
                    userId: req.id,
                    userEmail: user.Email,
                    HotelName: req.body.HotelDetails.HotelName,
                    HotelId: req.body.HotelDetails._id,
                    HotelAddress: req.body.HotelDetails.HotelAddress.place_name,
                    HotelImage: req.body.HotelDetails.HotelImages[0],
                }
            })
            const session = await stripe.checkout.sessions.create({
                customer: customer.id,
                line_items: [
                    {
                        price_data: {
                            currency: 'INR',
                            product_data: {
                                name: req.body.HotelDetails.HotelName,
                                images: [req.body.HotelDetails.HotelImages[0]],
                                metadata: {
                                    id: req.body._id,
                                }
                            },
                            unit_amount: totalCost * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: process.env.STRIPE_SUCCESS_URL,
                cancel_url: process.env.STRIPE_CANCEL_URL,
            });
            res.status(200).json({ url: session.url })
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "payment failed" })
        }
    },


    //stripe web Hook --------------------------------------------------------------------------------

    StripeWebHook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let endpointSecret = null
        let event;
        let jsonStringify = JSON.stringify(req.body)
        const payloadBuffer = Buffer.from(jsonStringify);
        let data;
        let eventType;

        if (endpointSecret) {
            try {
                event = stripe.webhooks.constructEvent(payloadBuffer, sig, endpointSecret);
                console.log('webhook verified');
            } catch (err) {
                console.log(`Webhook Error: ${err.message}`);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            data = event.data.object
            eventType = event.type
        } else {
            data = req.body.data.object
            eventType = req.body.type
        }
        if (eventType === "checkout.session.completed") {
            stripe.customers.retrieve(data.customer).then(async (res) => {
                const reservationDetails = {

                    Booking:"Booked",
                    customerId: res.id,
                    customerEmail: res.email,
                    custometName: data.customer_details.name,
                    country: data.customer_details.address.country,
                    currency: data.currency,
                    paymentMethod: data.payment_method_types[0],
                    paymentStatus: data.payment_status,
                    SubTotal: data.amount_subtotal,
                    Total: data.amount_total,
                    HotelDetails: {
                        HotelName: res.metadata.HotelName,
                        HotelId: res.metadata.HotelId,
                        HotelAddress: res.metadata.HotelAddress,
                        HotelImage: res.metadata.HotelImage,
                    },
                    BookingDetails: {
                        CheckIn: res.metadata.CheckIn,
                        CheckOut: res.metadata.CheckOut,
                        NumberOfNights: res.metadata.NumberOfNights,
                        TotalGusts: res.metadata.TotalGusts,
                        numberOfAdults: res.metadata.numberOfAdults,
                        numberOfChildren: res.metadata.numberOfChildren,
                        numberOfInfants: res.metadata.numberOfInfants,
                        totalCost: res.metadata.totalCost,
                    },
                    hostDetails: {
                        hostId: res.metadata.hostId,
                        hostName: res.metadata.hostName,
                        Email: res.metadata.Email,
                    },
                    userDetails: {
                        userName: res.metadata.userName,
                        userId: res.metadata.userId,
                        userEmail: res.metadata.userEmail
                    },   
                }
                const response = await User.reserveHotel(reservationDetails)
                     if(response){
                          User.updateHotelToBooked(response)
                     }
                })
        }
        res.send().end();
    },

    getReservations: (req, res) => {
        const userId = req.id
        User.getUserReservations(userId).then((response) => {
            res.status(200).json({ response })
        })
            .catch((err) => {
                res.status(500).json({ message: "No reservations found" })
            })
    },

    getFilteredReservations:async(req,res)=>{
        const userId = req.id
        const value = req.params.value
        
        // if(value === "All"){
        //   const response = await User.getUserReservations(userId)
        //   return res.status(200).json(response)
        // }
          User.getFilteredReservation(value,userId).then((response)=>{
            res.status(200).json({ response })
          })
          .catch((err) => {
            res.status(500).json({ message: "No reservations found" })
        })
        
    },

    cancelReservation:(req,res)=>{
           const BookingId = req.params.BookingId
           User.cancelReservation(BookingId).then((response)=>{
                 res.status(200).json({response})
           })
           .catch((error)=>{
                res.status(500).json({message:"cancel failed"})
           })
    }


}