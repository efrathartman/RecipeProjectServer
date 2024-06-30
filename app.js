const express=require("express");
const morgan=require("morgan");
const cors=require("cors");
const userRouter=require("./routes/user.route");
const recipeRouter=require("./routes/recipe.route");
const categoryRouter=require("./routes/category.route")
const { PageNotFound, serverNotFound } = require("./middlewares/handleErrors");

require('dotenv').config();// טעינת קובץ הגדרות environment (.env)
require('./config/db');// קריאה לקובץ המכיל את ההגדרות של מסד הנתונים
const app=express();// יצירת אפליקציה חדשה באמצעות Express
app.use(express.json());// שימוש ב- middleware של Express עבור המרה של JSON
app.use(express.urlencoded({extended:true}));//שימוש ב- middleware של Express עבור המרה של נתונים מסוג URL-encoded
app.use(morgan("dev"));// שימוש ב- middleware של Morgan עם פורמט "dev" להצגת לוגים בצורה קצרה
app.use(cors());// שימוש ב- middleware של Cors עבור ניהול CORS בין שרתים
app.get('/',(req,res)=>{
    res.send("wellcome");
})
app.use("/users",userRouter);
app.use("/recipes",recipeRouter);
app.use("/categories",categoryRouter);
app.use(PageNotFound);
app.use(serverNotFound);
const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});