const mongoose = require('mongoose');

//const MONGO_URI = process.env.MONGO_URI;

mongoose.connect("mongodb+srv://joseph:101998joe@cluster0.thxuyos.mongodb.net/elek_consulting_group",{
     useNewUrlParser: true,
     useUnifiedTopology: true,
   }).then(()=>{
     console.log('Connection to database successful');
}).catch((err)=>{
       console.error(err);
});



