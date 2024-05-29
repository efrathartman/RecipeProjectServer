const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Recipe, recipeValidator } = require('../models/recipe.model');
const mongoose = require('mongoose');
const { Category } = require('../models/category.model');
exports.getAllRecipes = async (req, res, next) => {
    let { search, page, perPage } = req.query;
    search ??= '';
    page ??= 1;
    perPage ??= 3;

    try {
        const recipes = await Recipe.find({recipename:new RegExp(search),isPrivate:false})
           .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        //  const recipeses= recipes.filter(x=>x.isPrivate===false)
           return res.json(recipes)
    } catch (error) {
        next(error);
    }
};
exports.getDetailsById=async(req,res,next)=>{
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
       next({message:"id is not valid"})
    else{
        Recipe.findById(id,{__v:false})
        .then(c=>{
           res.json(c);
        })
        .catch(err=>{
            next({ message: 'recipe not found', status: 404 })
        })
    }
}
exports.getRecipesByUseId=async(req,res,next)=>{
    const id=req.params.id;
    try {
        const recipes = await Recipe.find();
        const filteredRecipes = recipes.filter(recipe => recipe.userName._id= id);
        if (filteredRecipes.length > 0) {
            res.json(filteredRecipes);
        } else {
            next({ message: 'recipe not found', status: 404 });
        }
    } catch (err) {
        next(err);
    }
}

exports.getDetailsByTime=async(req,res,next)=>{
    const time=req.params.time;
    try {
        const recipes = await Recipe.find();
        const filteredRecipes = recipes.filter(recipe => recipe.timeOfMinutes <= time);
        if (filteredRecipes.length > 0) {
            res.json(filteredRecipes);
        } else {
            next({ message: 'recipe not found', status: 404 });
        }
    } catch (err) {
        next(err);
    }
}

exports.addCategory=async(req,res,next)=>{
  try{
    const c=new Category({description:req.categoryName} );
    await c.save();
    return res.status(201).json(c)
  }catch(error){
  console.log("lll");
  }
}

// exports.addRecipe=async(req,res,next)=>{
   
//     try{
//         console.log("llll");
//      let isexit=false;
//       const r=new Recipe(req.body) 
//       const existingCategory = await Category.findOne({ description: r.categories.categoryName })
//         if (!existingCategory ) 
//             {
//                 try{
//                     const c=new Category(
//                         {
//                            code:6,
//                            description:r.categories.categoryName,
//                            recipesOfCategory:[],
//                         }
//                      )
//                      await c.save();
//                   }catch(error){
//                   console.log("lll");
//                   } 
//             }
//       await r.save();
//       return res.status(201).json(r)
//     }catch(error){
//       next(error);
//     }
//   }
exports.addRecipe = async (req, res, next) => {
    const v=recipeValidator.addAndUpdateRecipe.validate(req.body);
    if(v.error)
        return next({message:v.error.message})
    console.log("llll");
    try {
        if(req.user.role==="manage" || req.user.role==="admin")
    {
      const r = new Recipe(req.body);
      let isExist = false;
      let foundCategory;
      for (let index = 0; index < r.categories.length; index++) {
         foundCategory = await Category.findOne({ description: r.categories[index].categoryName });
        // if (foundCategory > 0) {
        //   isExist = true;
        //   break;
        // }
      }
  
      if (!foundCategory) {
        try {
          for (let index = 0; index < r.categories.length; index++) {
            const c = new Category({
               
                description: r.categories[index].categoryName, // העתקת כל התכונות
                recipesOfCategory:{name: r.recipename,image:r.img}
                // recipesOfCategory:[]
            });
            await c.save();
          }
        } catch (error) {
          console.log("lll");
        }
      }
      else{
        console.log(foundCategory);
        foundCategory.recipesOfCategory.push({ name: r.recipename, image: r.img });
        await foundCategory.save();
      }
  
      await r.save();
      return res.status(201).json(r);
    }
    else{
        next({ message: 'only manage can or admin' });
    }
    } catch (error) {
      next(error);
    }
  };
  
  
exports.updateRecipe=async(req,res,next)=>{
    const v=recipeValidator.addAndUpdateRecipe.validate(req.body);
    if(v.error)
        return next({message:v.error.message})
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        next({message:'id is not valid'})
    try{
        if(req.user.role==="manage" || req.user.role==="admin")
            {
        const r=await Recipe.findByIdAndUpdate(
            id,
            {$set:req.body},
            {new:true}
        )
        return res.json(r);
    }
    else{
        next({ message: 'only manage can or admin' });
    }
    }catch(error)
    {
        next(error)
    }
       
}
exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Recipe.findById(id)))
                return next({ message: 'recipe not found!!!', status: 404 })
            if(req.user.role==="manage" || req.user.role==="admin")
            {
             let r= await Recipe.findByIdAndDelete(id)
         
            for (let index = 0; index < r.categories.length; index++) {
                foundCategory = await Category.findOne({ description: r.categories[index].categoryName });
                if(foundCategory.recipesOfCategory.length!==1)
                    {
                        console.log("ttt");
                        foundCategory.recipesOfCategory = foundCategory.recipesOfCategory.filter(recipe => recipe.name !== r.recipename);
                        await foundCategory.save()
                    }
                else{
                    console.log(foundCategory._id);
                  await Category.findByIdAndDelete(foundCategory._id)
                }
             }
            return res.status(204).send();
            }
            else{
                next({ message: 'only manage can or admin' });
            }
        } catch (error) {
            return next(error)
        }
    }
};



