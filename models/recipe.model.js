
const mongoose=require('mongoose');
const { addRecipe } = require('../controller/recipes.controller');
const Joi = require('joi');

const layerSchema=new mongoose.Schema({
   description:{type:String,require:true},
   ingredients:{type:[String],require:true},

})
const minimalUser=new mongoose.Schema({
    id:{type:Number,require:true},
    userName:{type:String,require:true}
})
const minimalCategory=new mongoose.Schema({
    categoryName:{type:String,require:true}
})

const recipeSchema=new mongoose.Schema({
  recipename:{type:String, require:true},
  description:{type:String},
  timeOfMinutes:{type:Number,require:true},
  level:{type:Number,enum:[1,2,3,4,5]},
  dataAdd:{type:Date},
  layersOfCake:[layerSchema],
  instructions:{type:String,require:true},
  img:{type:String,require:true},
  isPrivate:{type:Boolean,require:true},
   userName:[minimalUser],
   categories:[minimalCategory]
})
module.exports.recipeSchema=recipeSchema;
module.exports.Recipe=mongoose.model('recipe',recipeSchema)
module.exports.recipeValidator={
    addAndUpdateRecipe:Joi.object({
        recipename:Joi.string().required().min(2).max(20),
        description:Joi.string().required().max(100),
        timeOfMinutes:Joi.number().required(),
        level:Joi.number().required(),
        dataAdd:Joi.date().required(),
        layersOfCake:Joi.array().items(
            Joi.object({
                description: Joi.string().required(),
                ingredients: Joi.array().items(Joi.string()).required()
            })
        ).required(),
        instructions:Joi.string().required().max(500),
        img:Joi.string().required(),
        isPrivate:Joi.bool().required(),
        userName:Joi.required(),
        categories:Joi.array().items(Joi.object({
            categoryName:Joi.string().required()
    })).required()
    }),
 
}