var express = require('express');
const { verifyHost } = require('../Controllers/Hostcontroller');
var router = express.Router();
const HostController = require("../Controllers/Hostcontroller");
const { refreshTokenHost } = require('../Controllers/Hostcontroller');

/* GET users listing. */
router.get('/', HostController.hostHome);
router.post('/signup',HostController.hostSignup)
router.post('/login',HostController.hostLogin)
router.post('/addhotel',verifyHost,HostController.addHotel)
router.get('/getonehoteldata/:hotelId',HostController.getOneHotel)
router.post('/edithotel/:hotelId',verifyHost,HostController.editHotel)
router.get("/refreshhost",refreshTokenHost,HostController.hostHome)
router.get("/logout",HostController.logOut)
router.get('/gethoteldata',verifyHost,HostController.getHoteldata)
router.delete('/removehotel/:hotelId',verifyHost,HostController.removeHotel)
router.get('/reservations/:hostId',verifyHost,HostController.getAllreservations)


module.exports = router;
