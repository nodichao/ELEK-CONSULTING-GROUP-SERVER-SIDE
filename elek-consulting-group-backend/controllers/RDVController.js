const RDVModel = require('../models/RDVModel');
const UserModel = require('../models/UserModel');

const ErrorHandler = (err)=>{
      // console.log('message: ',err.message,' code :',err.code);
      const errors = {note:'',status:'',pro:''};
     
    
    if(err.message.includes('RDVModel validation failed')){
        Object.values(err.errors).forEach((error)=>
              errors[error.path] = error.message
         );
        return errors;
    }
    if(err.code === 11000){
        return ({email: 'email deja utilisé'});
    }
    
  }

// definition des methodes CRUD pour articles
module.exports.createRDV = async (req, res)=>{
    const id = req.params.id;
    const {domain,date,hour,note} = req.body;
    const pro = await UserModel.findRandomUserByProfession(domain); 
    console.log(hour);
   const DateTime = new Date(`${date}T${hour}`);
     try{
               
          const rdv = await RDVModel.create({date:DateTime,domain,note,student:id,pro:pro._id});
           
           res.status(201).json(rdv);

     }catch(err){
                 const error = ErrorHandler(err);
                  res.status(400).json(error);
     }
}


module.exports.findRDVs = async(req, res)=>{
      try{
            const rdvs = await RDVModel.find().populate('student').populate('pro');
            res.status(200).json(rdvs)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.findRDVsForOneStudent = async(req, res)=>{
    const id = req.params.id;
    try{
          const rdv = await RDVModel.find({student:id}).populate('pro');
          res.status(200).json(rdv);
    }catch(err){
          console.error(err);
          res.status(400).json({error:'echec de l\'operation'});   
    }
}

module.exports.findRDVsForOnePro = async(req, res)=>{
      const id = req.params.id;
      try{
            const rdvs = await RDVModel.find({pro:id}).populate('student');
            res.status(200).json(rdvs);
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
  }


module.exports.updateRDV = async(req, res)=>{
      const id = req.params.id;
      try{
            const rdv = await RDVModel.findByIdAndUpdate({_id: id},{...req.body});
            res.status(200).json(rdv)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.deleteRDV = async(req, res)=>{
      const id = req.params.id;
      try{
            const rdv = await RDVModel.findByIdAndDelete({_id: id});
            res.status(200).json(rdv);
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

