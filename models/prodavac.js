var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var validator=require('validator');
var passportLocalMongoose=require('passport-local-mongoose');

var prodavacSchema=new mongoose.Schema({
tipkorisnika:{
    type:String,
    required:true
},
ime:{
    type:String,
    required:true,
    trim:true
},
prezime:{
    type:String,
    required:true,
    trim:true
},
username:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validator(value){
        if(!validator.IsEmail(value))
            throw new Error('Email is invalid')
    }
},
password:{
    type:String,
    required:true,
    minlength:7
},
telefon:{
    type:String,
    required:true,
},
prodavnice:[{type:mongoose.Schema.Types.ObjectId,ref:"Prodavnica"}]
});

prodavacSchema.pre('save', async function (next){
    if(this.isModified('password'))
        this.password= await bcrypt.hash(this.password,8)
    next()
});

prodavacSchema.methods.getPublic = function() {
    const object=this.toObject();

    delete object.password;
    return object;
};

prodavacSchema.statics.findByCredentials = async (email, password) => {
    const user=await prodavac.findOne({email})

    if (!user)
        return null;
    
    const t= await bcrypt.compare(password,user.password)
    if (!t)
        return null;
    return user
};
prodavacSchema.plugin(passportLocalMongoose,{usernameField:"email"});
const prodavac=mongoose.model("Prodavac",prodavacSchema);
module.exports=prodavac;