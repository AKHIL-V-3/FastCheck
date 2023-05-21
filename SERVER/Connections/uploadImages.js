const cloudinary = require('cloudinary').v2;


// Configuration 

cloudinary.config({
  cloud_name: "dllnmynn6",
  api_key: "945515181514181",
  api_secret: "nt9DN31J74GB4Ojc4PDUMTR9YHw"
});


const opts ={

     overwrite:true,
     invalidate:true,
     resource_type:"auto"
}


const uploadImage = (image)=>{

      return new Promise((resolve,reject)=>{

           cloudinary.uploader.upload(image,opts,(err,result)=>{

               if(result && result.secure_url){
                 console.log(result.secure_url);

                 return resolve(result.secure_url)
               }
               return reject(err)
           })
      })
}
  
module.exports.uploadmultipleImages = (images)=>{

       return new Promise((resolve,reject)=>{      
        const uploads = images.map((base)=>uploadImage(base))
        Promise.all(uploads)
        .then((values)=>resolve(values))
        .catch((err)=>reject(err))
       })
}





// // Upload

// const res = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag"})

// res.then((data) => {
//   console.log(data);
//   console.log(data.secure_url);
// }).catch((err) => {
//   console.log(err);
// });


// // Generate 
// const url = cloudinary.url("olympic_flag", {
//   width: 100,
//   height: 150,
//   Crop: 'fill'
// });



// // The output url
// console.log(url);
// // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag