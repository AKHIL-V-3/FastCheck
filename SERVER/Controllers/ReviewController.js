const Conversation = require("../Models/Conversation")
const HostModel = require("../Models/HostModel")
const Messages = require("../Models/Messages")
const UserModel = require("../Models/UserModel")
const ReviewModel = require("../Models/Review")
const RatingModel = require("../Models/Rating")
const Hostcontroller = require("./Hostcontroller")
const hotel = require("../Models/HotelModel")
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {


    checkUserBooked:async(req,res)=>{
        try{
            const isBooked  = await hotel.ReservationSchema.find({
                 $and:[

                     {"userDetails.userId" : req.body.userId},
                     {"HotelDetails.HotelId" :req.body.hotelId}
                 ]
            })
               if(isBooked.length > 0){
                   res.status(200).json(isBooked)
                }else{
                    res.status(500).json({message:"Book this Hotel first"})
                }

           }catch(err){
            console.log(err);
            res.status(500).json({message:"Error"})
           }


    },

    addReview:async(req,res)=>{
           try{
                const response = await ReviewModel.create(req.body)
                res.status(200).json(response)
           }catch(err){
            console.log(err);
            res.status(500).json({message:"Error"})
           }
    },
    getReviews:async(req,res)=>{
        try{
            const response = await ReviewModel.aggregate([  
                { 
                   $match:{
                    hotelId:req.params.hotelId
                   }
                },
                {
                       $sort:{_id:-1}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:'User'
                    }    
                },
                {
                    $unwind:"$User"
                }
               
            ])
            res.status(200).json(response)
       }catch(err){
        console.log(err);
        res.status(500).json({message:"Error"})
       }
          
    },

    getReviewCount:async(req,res)=>{
          
        try{
       
            const count = await ReviewModel.aggregate([  
                { 
                   $match:{
                    hotelId:req.params.hotelId
                   }
                },
                {
                       $sort:{_id:-1}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:'User'
                    }    
                },
                {
                    $unwind:"$User"
                },
                {
                    $count:"reviewtext"
                }
               
            ])

            if(count.length === 0) return res.status(200).json({reviewtext:0})

            res.status(200).json(count[0])


        }catch(err){
        
        console.log(err);
        res.status(500).json({message:"Error"})

        }

    },

    addRating:async(req,res)=>{
        try{
            const isRated = await RatingModel.find({
                $and:[
                    {userId:new ObjectId(req.body.userId)},
                    {hotelId:new ObjectId(req.body.hotelId)},
                ]
            })
           if(isRated.length === 1){
            const response = await RatingModel.findByIdAndUpdate(isRated[0]._id,{ rating: req.body.rating }, { new: true })
            res.status(200).json(response)
            return
            }
           const response = await RatingModel.create(req.body)
             res.status(200).json(response)

          }catch(err){

            console.log(err);
            res.status(500).json(err)
          }
    },

    getRating:async(req,res)=>{
         try{

            const ratings = await RatingModel.find({hotelId:req.params.hotelId})
            const average = await RatingModel.aggregate([

                    {
                        $match:{
                            hotelId:req.params.hotelId
                        }
                    },
                    {
                        $group:{

                            _id: null,
                            avgRating: { $avg: '$rating' }
                        }
                    }

            ])

            if(ratings.length === 0 && average.length === 0) return res.status(200).json({rating:0})

            const response = {
                 rating:average[0].avgRating,
                 hotelId:ratings[0].hotelId
            }
            res.status(200).json(response)

         }catch(err){
            res.status(500).json(err)
         }
    },

    getUserRating:async(req,res)=>{
           try{
            const userRating = await RatingModel.find({
                $and:[
                    {userId:req.params.userId},
                    {hotelId:req.params.hotelId}
                ]
            }) 
            res.status(200).json(userRating[0])
           }catch(err){
            res.status(500).json(err)
               console.log(err);
           }
    }


}