const bcrypt = require('bcrypt');
const Joi = require('joi');
const { userValidator, User, generateToken } = require('../models/user.model');

exports.signIn=async(req,res,next)=>{
    const v=userValidator.loginSchema.validate(req.body);
    if(v.error)
        return next({message:v.error.message})
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(user)
        {
         bcrypt.compare(password,user.password,(err,same)=>{
            if(err)
                return next(new Error(err.message));
            if(same){
                const token=generateToken(user);
                user.password="****";
                return res.send({user,token});
            }
            return next({message:'Auth Failed',status:401})
         })
        }
        else{
            return next({message:'Auth Failed',status:401})
        }
}
exports.signUp=async(req,res,next)=>{
    const v=userValidator.singUpSchema.validate(req.body);
    if(v.error)
        return next({message:v.error.message})
    const {username,password,email,address,role}=req.body;
    try{
        const user=new User({username,password,email,address,role});
        await user.save();
        const token=generateToken(user);
        user.password="****";
        return res.status(201).json({user,token});
    }catch(error){
        return next({message:error.message,status:409})
    }   

}
exports.getAllUsers = async (req, res, next) => {
  
    try {
        if(req.user.role==="manage")
            {
                const users = await User.find().select('-__v');
                return res.json(users)
            }
            
       else{
        next({ message: 'only manage can get users' });
       }

       
    } catch (error) {
        next(error);
    }
};
