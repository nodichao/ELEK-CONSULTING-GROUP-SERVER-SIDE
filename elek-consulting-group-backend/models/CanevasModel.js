const mongoose = require('mongoose');
// definition du modele pour les RDVs
const UserModel = require('../models/UserModel');
const CanevasSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required : [true,"Le canevas doit appartenir a quelqu'un"]
    }
})

const CanevasModel = mongoose.model('CanevasModel',CanevasSchema);

module.exports = CanevasModel;