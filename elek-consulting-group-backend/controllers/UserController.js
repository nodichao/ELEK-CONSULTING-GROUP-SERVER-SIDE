const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const maxAge = 60*60*24*3;
const createToken = (id)=>{

      return jwt.sign({id},'jojosecret',{expiresIn:maxAge});
}

const ErrorHandler = (err)=>{
    console.log(err.message,err.code);
    const errors = {firstName:'',lastName:'',email:'',password:'', phone_number:''};
   
  
  if(err.message.includes('UserModel validation failed')){
      Object.values(err.errors).forEach(({properties})=>
            errors[properties.path] = properties.message
       );
      return errors;
  }
  if(err.code === 11000){
      return ({email: 'email deja utilisé'});
  }

  if(err.message ==='invalid email'){
      errors.email ="cet email n'existe pas";
  }
  if(err.message ==='invalid password'){
      errors.password ="mot de passe incorrect";
  }
  return errors;
  
}
// definition des methodes CRUD pour Users
module.exports.createUser = async (req, res)=>{
      
     try{
         const {firstName,lastName,email,password,phone_number,role,profession} = req.body;      
           const user = await UserModel.create({firstName,lastName,email,password,phone_number,role,profession});
           /*console.log(user);*/
           
           res.status(201).json(user._id);

     }catch(err){
                 const error = ErrorHandler(err);
                  res.status(400).json(error);
     }
}

module.exports.loginUser = async (req, res)=>{
      const {email, password} = req.body;
      try{
            const user = await UserModel.login(email,password);
            const token = createToken(user._id);
            res.cookie('jwt',token,{maxAge:maxAge*1000});
            res.status(200).json(user);
      }catch(err){
            const errors = ErrorHandler(err);
            res.status(400).json(errors);
      }
 }

 module.exports.logoutUser =(req,res)=>{
   res.cookie('jwt','',{maxAge:1});
   res.status(200).json({message:'user logged out'});
 }

module.exports.findUsers = async(req, res)=>{
      try{
            const users = await UserModel.find();
            res.status(200).json(users);
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.findPros = async(req, res)=>{
      try{
            const pros = await UserModel.find({role:"pro"});
            res.status(200).json(pros);
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.findOneUser = async(req, res)=>{
      let id = req.params.id;
      /*id = mongoose.Types.ObjectId(id);*/
 
      try{
            const users = await UserModel.find({_id:id});
            res.status(200).json(users)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.updateUser = async(req, res)=>{
      const id = req.params.id;
      try{
            const user = await UserModel.findByIdAndUpdate({_id: id},{...req.body},{new:true});
            res.status(200).json(user)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de la mise a jour'});   
      }
}

module.exports.updateUserPass = async (req, res)=>{
            const id = req.params.id;
            const {oldPass,newPass} = req.body;

            const user = await UserModel.findOne({_id:id});
            if(user){
                    const match = await bcrypt.compare(oldPass,user.password);
                    if(match){
                          const salt = await bcrypt.genSalt();
                          const passToSave = await bcrypt.hash(newPass,salt);
                          const updatedUser = await UserModel.findByIdAndUpdate({_id:id},{password:passToSave},{new:true});
                          res.status(200).json({newPass});
                    }else{
                        res.status(400).json({error :'mot de passe incorrect'});
                    }
            }else{
                  res.status(400).json({error :'user not found'});
            }
              
}
module.exports.deleteUser = async(req, res)=>{
      const id = req.params.id;
      try{
            const user = await UserModel.findByIdAndDelete({_id: id});
            res.status(200).json(user)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de la suppression'});   
      }
}

