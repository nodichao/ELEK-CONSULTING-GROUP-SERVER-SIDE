const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const AuthMiddleware = (req, res, next)=>{

    const token = req.cookies.jwt;

    if(token){
            jwt.verify(token,'jojosecret',(err,decodedToken)=>{
                    if(err){
                        console.log(err);
                        res.status(400).json(err)
                    }else{
                             //console.log(decodedToken);
                            next();
                    }
            })
    }else{
        console.log('user is not authenticated');
            res.status(400).json({error :'user is not authenticated'});
    }
}

const checkUser = (req,res,next)=>{

    const token = req.cookies.jwt;
   
    if(token){
        /*console.log('token existe')
        next();*/
        jwt.verify(token,'jojosecret',async (err,decodedToken)=>{
            if(err){
                console.log(err);
                res.locals.user = null;
                console.log('le voici'+res.locals.user);
                next();
            }else{
                console.log(decodedToken);
                 let user = await UserModel.findOne({_id : decodedToken.id});
                 res.locals.user = user;
                 console.log('le voici'+res.locals.user);
                 //console.log(res.locals.user);
                 //console.log(user);
                 //console.log('trouve');
                 next();
            }
       })
    }else{
        //console.log('token existe pas')
        //next()
        res.locals.user = null;
        console.log('le voici'+res.locals.user);
    
        next();
    }
}
module.exports = {AuthMiddleware,checkUser};