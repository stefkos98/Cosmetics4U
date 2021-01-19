var mongoose = require('mongoose');
var validator = require('validator');

var prodavnicaSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true,
    },
    adresa: {
        type: String,
        required: true,
    },
    telefon:{
        type:String,
        required:true,
    },
    proizvodi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proizvod"
    }]
});
module.exports = mongoose.model("Prodavnica", prodavnicaSchema);