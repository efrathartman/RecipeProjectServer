
const mongoose=require('mongoose');
const minimalRecipe=new mongoose.Schema({
    id:{type:Number},
    recipename:{type:String},
    image:{type:String},
})
const categorySchema=new mongoose.Schema({
    
    description:{type:String,require:true},
    recipesOfCategory:[minimalRecipe]
})

module.exports.categorySchema=categorySchema;
module.exports.Category=mongoose.model('categories',categorySchema);