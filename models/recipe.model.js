
const mongoose=require('mongoose');

const Joi = require('joi');

const layerSchema=new mongoose.Schema({
   description:{type:String,require:true},
   ingredients:{type:[String],require:true},

})
const minimalUser=new mongoose.Schema({
    id:{type:String,require:true},
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
  dataAdd:{type:Date,require:true},
  layersOfCake:[layerSchema],
  instructions:{type:String,require:true},
  img:{type:String,require:false},
  isPrivate:{type:Boolean,require:true},
  userName:[minimalUser],
  categories:[minimalCategory]
})
module.exports.recipeSchema=recipeSchema;
module.exports.Recipe=mongoose.model('recipe',recipeSchema)
module.exports.recipeValidator={
    addAndUpdateRecipe:Joi.object({
        recipename:Joi.string().required().min(2).max(30),
        description:Joi.string().required(),
        timeOfMinutes:Joi.number().required(),
        level:Joi.number().required(),
        dataAdd:Joi.date().required(),
        layersOfCake:Joi.array().items(
            Joi.object({
                description: Joi.string().required(),
                ingredients: Joi.array().items(Joi.string()).required()
            })
        ).required(),
        instructions:Joi.string().required(),
        img:Joi.string(),
        isPrivate:Joi.bool().required(),
        userName:Joi.required(),
        categories:Joi.array().items(Joi.object({
            categoryName:Joi.string().required()
    })).required()
    }),
 
}