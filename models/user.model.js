const bcrypt=require('bcrypt');
const joi=require('joi');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const Joi = require('joi');

const userSchema=new mongoose.Schema({
    username:{type:String, require:true,minlength:[2,'the name must be at least 2 char'],},
    password:{type:String,require:true,minlength:[4,'the name must be at least 2 char']},
    email:{type:String,require:true,unique:true},
    address:{type:String,require:true},
    role:{type:String,default:'user',enum:['user','manage']}
})
userSchema.pre('save',function(next){
    const salt= +process.env.BCRYPT_SALT | 10;
    bcrypt.hash(this.password,salt,async(err,hashPass)=>{
    if(err)
    {
        throw new Error(err.message)
    }
    this.password=hashPass;
    next();
    })
})
module.exports.userSchema=userSchema;
module.exports.User=mongoose.model('users',userSchema);
module.exports.userValidator={
    loginSchema:Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(4).max(10).required()
    }),
    singUpSchema:Joi.object({
      username:Joi.string().required(),
      password:Joi.string().min(4).max(10)
      .required().pattern(new RegExp('^(?=.*[A-z])(?=.*[0-9])'))
      .error(new Error('Password must be at least one number and one letter')),
      email:Joi.string().required().email(),
      address:Joi.string().required(),
      role:Joi.string().required(),
    })
}
module.exports.generateToken=(user)=>{
    const privateKey=process.env.JWT_SECRET || 'JWT_SECRET';
    const data={role: user.role, user_id:user._id};
    const token=jwt.sign(data,privateKey,{expiresIn:'1h'})
    return token;
}