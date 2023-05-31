const express = require('express');
var router = express.Router();
const AdminController = require("../Controllers/AdminController")
const {verifyAdminToken} = require("../Controllers/AdminController")



router.get('/',verifyAdminToken, AdminController.Dashboard);
router.post('/login', AdminController.adminLogin);
router.get('/refreshadmin',verifyAdminToken, AdminController.Dashboard);
router.get('/getusercount', AdminController.getUserCount);
router.get('/gethostcount', AdminController.getHostCount);
router.get('/getbookingcount', AdminController.getBookingCount);
router.get('/logout', AdminController.logOut);




module.exports = router;
