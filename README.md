
# Server Recipe

## Installation

### Before starting the server, make sure to install the necessary Node.js modules:

### npm install

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

| dotenv
| Variable     | Description                                                |
| ------------ | ---------------------------------------------------------- |
| DB_URL       | MongoDB connection URL for your database.                   |
| PORT         | Port number on which the server will run.                  |
| BCRYPT_SALT  | Number of salt rounds for bcrypt hashing.                   |
| JWT_SECRET   | Secret key used for signing JWT tokens.                    |

## Endpoints

### Users Resource

| URL                                      | Method | Description                    | Permissions     | Parameters          | Optional Parameters | Body                | Headers         | Returns | Status Codes |
| ---------------------------------------- | ------ | ------------------------------ | --------------- | ------------------- | ------------------- | ------------------- | --------------- | ------- | ------------ |
| [http://localhost:5000/users/signin](http://localhost:5000/users/signin) | POST   | User sign in|-|-|-|{email,password}|-|user+token| 204|
| [http://localhost:5000/users/signup](http://localhost:5000/users/signup) | POST   | User sign up|-|-|-|{username,email,password,address,role}|-| User+token|204|
| [http://localhost:5000/users](http://localhost:5000/users)| GET    | Get all users|  admin|-|-|-|token|all user | 200|
|[http://localhost:5000/users/isEnabelad](http://localhost:5000/users/isEnabelad)|GET|get userid|-|-|-|-|token|userid|200|

### Recipes Resource

| URL| Method | Description| Permissions  | Parameters| Optional Parameters | Body  | Headers | Returns | Status Codes |
| ------------------------------------------------------------- | ------ | -------------------------------- | --------------- | ------------------- | ------------------- | ------------------ | --------------- | ------- | ------------ |
| [http://localhost:5000/recipes](http://localhost:5000/recipes) | GET | Get all recipes |-|-|חיפושים לפי: search-שם מתכון ,perPage-מספר מתכונים לעמוד,page-מספר עמוד| -| - |all recipes|200|
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | GET | Get recipe by id  | - |{id}|-|-|-|recipe by id|200|
| [http://localhost:5000/recipes/getRecipesByUseId/:id](http://localhost:5000/recipes/getRecipesByUseId/:id) | GET | Get recipes by user id  | admin/user |{userId}|-|-|token|recipe by user id|200|
| [http://localhost:5000/recipes/getDetailsByTime/:time](http://localhost:5000/recipes/getDetailsByTime/:time) | GET  | Get recipes by time  | -|{time} | - | - | - |recipes by time|200|
| [http://localhost:5000/recipes/addRecipe](http://localhost:5000/recipes/addRecipe) | POST | add recipe  |admin /user | -|-|{ recipe}|token| new recipe added|204| 
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | PUT | update recipe by id |admin/ user|{id}|-|{update recipe}|token| recipe updated|204|

| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id) | DELETE |   delete reipe by id | admin/ user |{id}|-|-|token|-|204|
### Categories Resource

| URL  | Method | Description | Permissions | Parameters | Optional Parameters | Body | Headers | Returns | Status Codes |
| ---------------------------------------------------------------- | ------ | -------------------------------- | --------------- | ------------------- | ------------------- | ------------------ | --------------- | ------- | ------------ |
| [http://localhost:5000/categories](http://localhost:5000/categories) | GET | Get all categories|everyone|-|-|-|-|all categories|200|        
| [http://localhost:5000/categories/getAllCategoryByRecipes/:name](http://localhost:5000/categories/getAllCategoryByRecipes/:name) | GET |  get all recipes by category name |everyone | {name} |-|-|-|all recipes by category name | 200     |
| [http://localhost:5000/categories/:id](http://localhost:5000/categories/:id) | GET    | get category by id with recipe| everyone |{id}|-|-|-|category by id with recipes |200|
```

