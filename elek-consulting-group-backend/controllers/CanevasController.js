const CanevasModel = require('../models/CanevasModel');

const ErrorHandler = (err)=>{
      // console.log('message: ',err.message,' code :',err.code);
      const errors = {name:'',owner:''};
     
    
   if(err.message.includes('CanevasModel validation failed')){
        Object.values(err.errors).forEach((error)=>
              errors[error.path] = error.message
         );
        return errors;
    }
    
  }

  module.exports.createCanevas = async (req, res)=>{

    const {name,owner} = req.body;  
     try{
               
           const canevas = await CanevasModel.create({name,owner});
           console.log(canevas);
           res.status(201).json(canevas);

     }catch(err){
                const error = ErrorHandler(err);
                  res.status(400).json(error);
     }
}


  module.exports.findCanevas = async(req, res)=>{
    const id = req.params.id;
    try{
          const canevas = await CanevasModel.find({owner: id});
          res.status(200).json(canevas)
    }catch(err){
          console.error(err);
          res.status(400).json({error:'echec de l\'operation'});   
    }
}
