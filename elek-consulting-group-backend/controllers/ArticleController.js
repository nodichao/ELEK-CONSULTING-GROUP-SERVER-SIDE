const ArticleModel = require('../models/ArticleModel');

const ErrorHandler = (err)=>{
      // console.log('message: ',err.message,' code :',err.code);
      const errors = {author:'',content_article:'',admin:''};
     
    
   if(err.message.includes('ArticleModel validation failed')){
        Object.values(err.errors).forEach((error)=>
              errors[error.path] = error.message
         );
        return errors;
    }
    
  }

// definition des methodes CRUD pour articles
module.exports.createArticle = async (req, res)=>{

    const {title,content_article,admin} = req.body;  
     try{
               
           const article = await ArticleModel.create({title,content_article,admin});
           console.log(article);
           res.status(201).json(article);

     }catch(err){
                const error = ErrorHandler(err);
                  res.status(400).json(error);
     }
}


module.exports.findArticles = async(req, res)=>{
      try{
            const articles = await ArticleModel.find().populate('admin');
            res.status(200).json(articles)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.findOneArticle = async(req, res)=>{
    const id = req.params.id;
    try{
          const article = await ArticleModel.find({_id:id}).populate('admin');
          res.status(200).json(article)
    }catch(err){
          console.error(err);
          res.status(400).json({error:'echec de l\'operation'});   
    }
}

module.exports.updateArticle = async(req, res)=>{
      const id = req.params.id;
      try{
            const article = await ArticleModel.findByIdAndUpdate({_id: id},{...req.body});
            res.status(200).json(article)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

module.exports.deleteArticle = async(req, res)=>{
      const id = req.params.id;
      try{
            const article = await ArticleModel.findByIdAndDelete({_id: id});
            res.status(200).json(article)
      }catch(err){
            console.error(err);
            res.status(400).json({error:'echec de l\'operation'});   
      }
}

