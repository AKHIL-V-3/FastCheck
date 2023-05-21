const Conversation = require("../Models/Conversation")
const HostModel = require("../Models/HostModel")
const Messages = require("../Models/Messages")
const UserModel = require("../Models/UserModel")
const Hostcontroller = require("./Hostcontroller")
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

    addConversation:async(req,res)=>{
            const newConversation = new Conversation({
            members:[req.body.senderId,req.body.receiverId]
        })
        const isExsist = await Conversation.find({
            members: { $all: [newConversation.members[0], newConversation.members[1]] } 
        })
       if(isExsist.length === 0){
           try{
               const savedConversation = await newConversation.save()  
               res.status(200).json(savedConversation)
            }catch(error){
                res.status(500).json(error)
            }         
        }else{
            res.status(200).json({message:"already contacted"})
        }
    },   

    getConversation:async(req,res)=>{
            try{
                const conversation = await Conversation.find({
                    members:{$in :[req.params.currentUserId] },
                })
                res.status(200).json(conversation)
            } catch(error){
                res.status(500).json(error)
            }
    },

    getHostConversation:async(req,res)=>{
        try{
            const conversation = await Conversation.find({
                members:{$in :[req.params.userId] },
            })
            res.status(200).json(conversation)
        } catch(error){
            res.status(500).json(error)
        }
    },

    addMessage:async(req,res)=>{
           const newMessage = new Messages(req.body)
           try{
            const savedMessage = await newMessage.save()  
            res.status(200).json(savedMessage)
           }catch(error){
             res.status(500).json(error)
           }
    },

    getMessage:async(req,res)=>{  
        try{
            const messages = await Messages.find({
                conversationId:req.params.conversationId
            })
            res.status(200).json(messages)
        } catch(error){
            res.status(500).json(error)
        }   
    },

    getSelecedHost:async(req,res)=>{  
        const coversationId = req.params.coversationId  
        try{
            const User = await Conversation.aggregate([
                {
                    $match:{
                        _id:new ObjectId(coversationId)
                    }
                },
                {
                      $project:{
                           _id:1,
                           friendId:{ $arrayElemAt: ["$members", 1] },
                           createdAt:1
                      }
                },
                {
                    $project:{
                         _id:1,
                         userId:{$toObjectId: "$friendId"},
                         createdAt:1
                    }
               },
                {
                    $lookup:{

                        from:"hosts",
                        localField:"userId",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $unwind:"$user"
                }

            ])
            res.status(200).json(User[0])
        } catch(error){
            console.log(error);
            res.status(500).json(error)
        }  
    },
    getSelecedUser:async(req,res)=>{  
        const coversationId = req.params.coversationId  
        try{
            const User = await Conversation.aggregate([
                {
                    $match:{
                        _id:new ObjectId(coversationId)
                    }
                },
                {
                      $project:{
                           _id:1,
                           friendId:{ $arrayElemAt: ["$members", 0] },
                           createdAt:1
                      }
                },
                {
                    $project:{
                         _id:1,
                         userId:{$toObjectId: "$friendId"},
                         createdAt:1
                    }
               },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $unwind:"$user"
                }

            ])

            console.log(User,'uuuuuuuuuuuuuuuuuuu');
            res.status(200).json(User[0])
        } catch(error){
            console.log(error);
            res.status(500).json(error)
        }  
    },

    getHost:async(req,res)=>{
        try{
            const host = await HostModel.findById(req.params.hostId, "-Password")
            if(!host){
                const user = await UserModel.findById(req.params.hostId, "-Password")
                res.status(200).json(user)
                return
            }
            res.status(200).json(host)
        }catch(err){
            res.status(500).json(err)
        }
    },

    getUser:async(req,res)=>{
        try{
            const user = await HostModel.findById(req.params.userId, "-Password")
            res.status(200).json(user)
        }catch(err){
            res.status(500).json(err)
        }
    },

    getLastMessages:async(req,res)=>{
        try{
            const LastMessage = await Messages.find({
                conversationId:req.params.conversationId
            }).sort({_id:-1}).limit(1)
            res.status(200).json(LastMessage[0])
        }catch(err){
            res.status(500).json({err})
        }
    },

    getAllUsers:async(req,res)=>{
        
          try{
            const userData = []
              const Users = await Conversation.aggregate([
                {
                    $match:{
                        members:{$in :[req.params.userId] }
                    }
                }
              ])
             const UserId =  Users.map((user)=>{ 
                  return user.members[1]
              })
              const resultArray = await Promise.all(UserId.map(async (id) => {
                const result = await HostModel.findById(id,"-password");
                return result;
              }));
              res.status(200).json(resultArray)
          }catch(err){
            console.log(err);
            res.status(500).json(err)
          }
    }
}