const mongoose = require('mongoose');
// definition du modele pour les RDVs
const UserModel = require('../models/UserModel');
const RDVSchema = new mongoose.Schema({
    date :{
        type : Date,
        required : true,
        default : Date.now
    },
    note :{
        type : String,
        required : [true,"Vous devez ecrire un message pour mieux cadrer le rdv"]
    },
    student:{
            type :  mongoose.Schema.Types.ObjectId,
            ref:'UserModel',
            required : [true,"Le rdv doit etre affecté a un etudiant"]
    },
    domain:{
                type : String,
                required:[true,'Le domaine de coaching est obligatoire']
    },
    status:{
        type: String,
        enum : ['en attente', 'accepté','annulé','terminé'],
        default : 'en attente'
    },
    
    pro :{
        type : mongoose.Schema.Types.ObjectId, 
        ref:'UserModel', 
        required : [true,"Le rdv doit etre affecté a un professionnel"]
    }
})

const RDVModel = mongoose.model('RDVModel',RDVSchema);

module.exports = RDVModel;