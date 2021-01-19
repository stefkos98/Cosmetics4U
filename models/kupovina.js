var mongoose = require('mongoose');
var validator = require('validator');

var kupovinaSchema = new mongoose.Schema({
    kupac: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Korisnik"
    },
    datum: Date,
    proizvodi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proizvod"
    }],
    kolicina: [Number],
    cene: [Number],
    racun: Number
});
module.exports = mongoose.model("Kupovina", kupovinaSchema);