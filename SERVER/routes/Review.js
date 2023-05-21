const express = require('express');
const app = express();
var router = express.Router();
const reviewController = require("../Controllers/ReviewController");




router.post("/isbooked",reviewController.checkUserBooked)
router.post("/",reviewController.addReview)
router.get("/:hotelId",reviewController.getReviews)
router.get("/reviewcount/:hotelId",reviewController.getReviewCount)
router.post("/rating",reviewController.addRating)
router.get("/rating/:hotelId",reviewController.getRating)
router.get("/userrating/:userId/:hotelId",reviewController.getUserRating)






module.exports = router;