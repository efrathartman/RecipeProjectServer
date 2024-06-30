const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Category } = require('../models/category.model');
const mongoose = require('mongoose');
exports.getAllCategories=async(req,res,next)=>{
    try{
        const categories=await Category.find().select().select('-__v');
      
         return res.json(categories.map(category => {
            const selectedFields = {
                _id: category._id,
                code: category.code,
                description:category.description,
               recipesOfCategory:category.recipesOfCategory
                // description: category.description
            };
            return selectedFields;
        }));
        
    }catch(error){
        next(error);
    }
}
exports.getAllCategoryByRecipes=async (req,res,next)=>{
    const name = req.params.name;

    try{
        const category=await Category.findOne({ description: name })
        .populate('recipesOfCategory')
        .select('-__v');
        return res.json(category)
    }
    catch(error){
        next(error)
    }
}
exports.getCategoryById=async(req,res,next)=>{
    const id=req.params.id;
    try {
        const categories = await Category.find();
        const filteredCategory = categories.filter(category => category.id == id);
        if (filteredCategory.length > 0) {
            res.json(filteredCategory);
        } else {
            next({ message: 'category not found', status: 404 });
        }
    } catch (err) {
        next(err);
    }
}