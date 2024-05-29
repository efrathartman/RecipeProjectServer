const express=require("express");
const { getAllCategories, getAllCategoryByRecipes, getCategoryById } = require("../controller/category.controller");
const router=express.Router();
router.get("/",getAllCategories);
router.get("/getAllCategoryByRecipes/:name",getAllCategoryByRecipes);
router.get("/:id", getCategoryById);
module.exports=router;