const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_CONNECTION,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
      console.log("Connected");
})
.catch((error)=>{
     console.log(error.message);
})
module.exprorts = mongoose


















// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/jwt', {

//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('Connected!')).catch((error) => {
//         console.log(error);
//     })

// var app = express();

// app.use(
//     cors({

//         origin: ["http://localhost:3001"],
//         methods: ["GET", "POST"],
//         credentials: true
//     })

// )

