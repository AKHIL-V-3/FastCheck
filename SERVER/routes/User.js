const express = require('express');
const app = express();
const { verifyToken, refreshToken } = require('../Controllers/UserController');
var router = express.Router();

const userController = require("../Controllers/UserController");



/* GET home page. */

router.get('/',userController.Home);
router.post('/usersignup',userController.userSignup)
router.post('/userlogin',userController.userLogin)
router.get("/refresh",refreshToken,userController.Home)
router.get("/logout",userController.logOut)
router.get("/userprofile",verifyToken,userController.userProfile)
router.post("/userprofile/uploaduserimage",verifyToken,userController.uploadUserImage)
router.post("/userprofile/addpersonalinformation",verifyToken,userController.adduserInformation)
router.get("/getallhotels",userController.getAllHotels)
router.get("/getonehotel/:hotelId",userController.getHotelData)
router.post("/reservation",verifyToken,userController.HotelBook)
router.post('/webhook', express.json({type: 'application/json'}),userController.StripeWebHook)
router.get("/trips",verifyToken,userController.getReservations)
router.get("/filteredtrips/:value",verifyToken,userController.getFilteredReservations)
router.patch("/trips/cancelreservation/:BookingId",userController.cancelReservation)
router.get("/getuserimage/:userId",verifyToken,userController.getUserImage)
router.get('/paymenthistory/:userId',verifyToken,userController.getPaymentHistory)
router.get('/getreserveddates/:hotelId',userController.getReservedDates)


module.exports = router;
