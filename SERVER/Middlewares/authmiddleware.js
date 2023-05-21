
// const jwt =require("jsonwebtoken")

// const jwtSecret = "JsonWebAccessTokenSecretkey"

// module.exports ={
    
//       verifyToken:(req,res,next)=>{

//             console.log('heyyyyyyyyy');

//             const headers = req.headers['authorization']
//             const token = headers.split(" ")[1]

//            console.log(token,'tokennn');

//            if(!token){

//                 res.status(401).json({status:false,message:"Token not provided"})
//                 next()

//            }else{
              
//                  jwt.verify(token,"JsonWebAccessTokenSecretkey",(err,decod)=>{
                     
//                     if(err){

//                           res.status(401).json({status:false,message:"Invalid Token"})
//                           next()
//                     }else{

//                           console.log(decod,'useruseruseruseruser');

//                          req.user = decod.user
//                          next()
//                     }
                      
//                  })
                
//            }

//       },

// }




















        //    if(token){
               
        //        jwt.verify(token,"JsonWebAccessTokenSecretkey",async(err,decodedToken)=>{
        //              if(err){
                         
        //                 res.json({status:false})
        //                 next()
        //              }else{

        //                  const user = await Users.findById(decodedToken.id)
        //                  if(user) res.json({status:true,user:user.Email})
        //                  else res.json({status:false})
        //                  next()
        //              }
        //        })
        //    }else{

        //       res.json({status:false})
        //       next()
        //    }