const bcrypt = require('bcrypt');
const Joi = require('joi');
const { userValidator, User, generateToken } = require('../models/user.model');
const { Recipe } = require('../models/recipe.model');

exports.signIn=async(req,res,next)=>{
    // const id=req.user.user_id;
    // let r =await Recipe.find([userName.id:id])
    // req.body.id={userName:u.userName,_id:id}
    console.log(
        "kert"
    );
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
    const user=await User.findOne({email});
    if(user)
        return next({message:"user is exist"})
    try{
        // let arr=this.getAllUsers();
        // console.log(arr.email);
        const user=new User({username,password,email,address,role});
        await user.save();
        const token=generateToken(user);
        user.password="****";
        return res.status(201).json({user,token});
    }   catch(error){
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
exports.isEnabelad=async(req,res,next)=>
    {    try {
        // בדוק שהמשתמש מאומת ויש לו מזהה
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // החזר את מזהה המשתמש בתגובה
        return res.status(200).json({ userId: req.user.user_id });
    } catch (error) {
        // טיפול בשגיאות והחזרת תגובה עם שגיאה
        next(error);
    }
       
    }
