
const UserModel = require('../models/UserModel');
const CanevasModel = require('../models/CanevasModel');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require('path');
const router = require('../routes/router');
const { checkUser } = require('../Middlewares/AuthMiddleware');
const multer = require('multer');
const ArticleModel = require('../models/ArticleModel');


require('dotenv').config({ path: path.resolve(__dirname,'../.env')  });
require('../config/dbConfig');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
/*app.use(cors({
    origin: ['https://front-end-elek-consulting-group.vercel.app','http://localhost:3000', 'http://localhost:5000'],
    methods :["POST","GET","PUT","DELETE","OPTIONS"],
    credentials: true
}));*/

   app.use(cors());



const storage = multer.diskStorage(
  {
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname, '..', 'uploads'));
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`);
    }
  }
)

const upload = multer({storage:storage});

 

app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));
app.use('/', router);
app.post('/upload',upload.single('pdf'), async(req, res) => {
  try {
       
        const user = await UserModel.findOne({email:req.body.email});
        const canevas = await CanevasModel.create({name:req.file.filename, owner:user._id});
       
       
      res.status(201).json('Fichier téléchargé avec succès');
  } catch (error) {
      res.status(400).json({error});
  }});

  app.post('/article/upload',upload.single('image'), async(req, res) => {
      const {title, content,id} = req.body;
    try {
         
          const article = await ArticleModel.create({title,image:req.file.filename, content_article:content, admin:id});
          
          console.log(article);
         
        res.status(201).json('article envoyé avec succès');
    } catch (error) {
        res.status(400).json({error});
    }});
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Serveur démarré à l\'URL localhost:' + process.env.PORT);
});













