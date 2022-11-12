# Full_Stack_Ecommerce_Site_Part_2

Step 1: Make two folders "frontend" and "backend"

Step 2: Inside backend create two files "app.js" and "server.js"

Step 3: Inside root directory open a terminal and type command, "npm init" and inside the entry point, type "backend/server.js"

Step 4: Install the packages "npm install mongoose express dotenv"

Step 5: Install the package "npm install nodemon"

Step 6: Setup the app.js file as

			const express = require("express");

			const app = express();

			module.exports = app;


Step 7: Setup the server.js file as
			const app = require("./app");

			app.listen(process.env.PORT, ()=>{
			    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
			})

Step 8: Make a folder inside "backend" by the name "config" and inside config, make a file "config.env" and inside config.env type
			PORT=4000

Step 9: Import dotenv in "server.js" file as:

			const dotenv = require("dotenv")
			dotenv.config({path:"backend/config/config.env"})

Step 10: Add the following inside the "package.json" file, inside the "script" and here if we run start then it will open it in using node and if we run dev then it will open it using nodemon and we will use dev in the development mode but in the production mode we use node

			    "start": "node backend/server.js",
			    "dev": "nodemon backend/server.js"

Step 11: Make two folders inside the "backend" named "routes" and "controllers"

Step 12: Inside the "routes" make a new file "productRoute.js" and inside the "controllers", make a new file named "productController.js"

Step 13: Inside the "productController.js", type the following
```
			exports.getAllProducts = (req, res) => {
 			   res.status(200).json({message: "route is working fine"});
			}
```
Step 14: Inside the "productRoute.js", type the following
```
			const express = require("express");
			const { getAllProducts } = require("../controllers/productController");

			const router = express.Router();

			router.route("/products").get(getAllProducts);

			module.exports = router;
```
Step 15: Import the Route in your "app.js" file  and now your app.js file will look like the following:
```
			const express = require("express");
			const app = express();

			app.use(express.json());

			// Route Import
			const product = require("./routes/productRoute");

			app.use("/api/v1",product)

			module.exports = app;
```			
Step 16: Now open the terminal and run the app in the dev mode by
```
			npm run dev
```
Step 17: Now go to the postman and make a new Collection named "Ecommerce"... Now click on the + option at the top left and make a get request to 
			http://localhost:4000/api/v1/products

	You'll see the message on the screen inside the postman that "server is working fine"

_______________________________Connecting Database______________________________________________________

Step 18: Create a folder inside "config", named "database.js"

Step 19: Write the following code inside "database.js"
			const mongoose = require("mongoose");


			const connectDatabase = ()=>{
			    mongoose.connect(process.env.DB_URI).then((data)=>{
			        console.log(`MongoDB connected with server: ${data.connection.host}`);
			    }).catch((err)=>{
			            console.log(err);
			        })
			}

			module.exports = connectDatabase;


Step 20: Import the database inside the "server.js"

			const connectDatabase = require("./config/database");

Step 21: Run the connectDatabase function
			connectDatabase();

______________________________________________models_________________________________________________________

Step 22: Make a new folder named "models" inside "backend" folder.

Step 23: Make a new file named "productModel.js" inside "models"

Step 24: Make a product Schema inside "productModels.js"
			const mongoose = require("mongoose");

			const productSchema = new mongoose.Schema({
			    name: {
			        type:String,
			        required:[true, "Please enter the name of product"],
			        trim:true
			    },
			    description: {
			        type: String,
			        required:[true, "Please enter the description of product"]
			    },
			    price: {
			        type: Number,
			        required:[true, "Please enter the price of product"],
			        maxLength:[8, "Price cannot exceed 8 characters"]
			    },
			    rating: {
			        type: Number,
			        default:0
			    },
			    images: [
			        {
			            public_id: {
			                type:String,
			                required:true
			            },
			            url: {
			                type:String,
			                required: true
			            }
			        }
			    ],
			    category: {
			        type: String,
			        required:[true, "Please enter product category"]
			    },
			    Stock: {
			        type: Number,
			        required: [true, "Please enter product stock"],
			        maxLength: [4, "Stock length cannot exceed 4 characters"],
			        default: 1
			    },
			    numOfReviews: {
			        type: Number,
			        default: 0
			    },
			    reviews: [
			        {
			            name: {
			                type: String,
			                required: true
			            },
			            rating: {
			                type: Number,
			                required: true
			            },
			            comment: {
			                type: String,
			                required: true
			            }
			        }
			    ],
			    createdAt: {
			        type: Date,
			        default: Date.now
			    }
			})

			module.exports = mongoose.model("Product", productSchema);

______________________________________________createProduct_________________________________________________________

Step 25: Go to the "productController.js" inside "controllers" and type the following
```
				// Create Product --- Admin

				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);

				    res.status(201).json({
				        success: true,
				        product
				    })
				}
```
Step 26: Now the "productController.js" will be something like
```
				const Product = require("../models/productModel");

				// Create Product --- Admin

				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);
				
				    res.status(201).json({
				        success: true,
			        product
			    })
			}


				// Get All Products
				exports.getAllProducts = async (req, res) => {
				    const products = await Product.find();
			
				    res.status(200).json(
				        {
				            success: true,
				            products
				        }
				    )
				}
```
Step 27: Add a new router inside "productRoute.js" 

				router.route("/product/new").post(createProduct);

______________________________________________Update Product_________________________________________________________

Step 28: Add the following in "productController.js" 
				// Update Product --- Admin

				exports.updateProduct = async (req, res, next) => {
				    let product = Product.findById(req.params.id);
				
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }

				    product = await Product.findByIdAndUpdate(req.params.id, req.body,
			        {
			            new: true,
			            runValidators: true,
			            userFindandModify: false
				})

				    res.status(200).json({
				        success: true,
				        product
				    })
				}
______________________________________________Delete Product_________________________________________________________

Step 29: Add the following in "productController.js" 

				// Delete Product --- Admin

				exports.deleteProduct = async (req, res, next) => {
				    const product = await Product.findById(req.params.id);
		
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }
		
				    await product.remove();
			
				    res.status(200).json({
				        success: true,
				        message: "Product Deleted successfully"
				    })
				}

_____________________________________________Get Product Details_____________________________________________

Step 30: Inside the "productController.js" type the following

				// Get Product Details
				exports.getProductDetails = async (req, res, next)=>{
				    const product = await Product.findById(req.params.id);

				    if(!product){
				        res.status(500).json({
				            success: false,
				            message: "Product not found"
				        })
				    }
			
				    res.status(200).json({
				        success: true,
				        product
				    })
				}

Step 31: Add the routes of the above insde the "productRoute.js" as
```				
				router.route("/products").get(getAllProducts);
				router.route("/product/new").post(createProduct);
				router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);
```
____________________________________________Error Handling_________________________________________________

Step 32: Make a folder named "utils" inside the "backend" folder and make a file named "errorhandler.js" inside it

Step 33: Type the following inside the file
```
				class ErrorHandler extends Error{
   				 constructor(message, statusCode){
				        super(message);
				        this.statusCode = statusCode;

				        Error.captureStackTrace(this, this.constructor);
				    }
				}

				module.exports = ErrorHandler;
```
Step 34: Make a new folder named "middleware" inside the backend and make a new file named "error.js" inside it

Step 35: Type the following inside the "error.js" file
```
				const ErrorHandler = require("../utils/errorhandler");

				module.exports = (err, req, res, next) => {
				    err.statusCode = err.statusCode || 500;
				    err.message = err.message || "Internal Server Error";
	
				    res.status(err.statusCode).json({
				        success: false,
				        message: err.messages
				    })
				}
```
Step 36: Import the errorMiddleware inside the "app.js"
```
				const errorMiddleware = require("./middleware/error");
```
Step 37: Use the errorMiddleware inside the "app.js"... Remember to use it below "app.use("/api/v1",product)".
```
				app.use(errorMiddleware);
```
Step 38: Now you can go to the "productController.js" and update the files for example the "Get Product Details" will look like the following. But you have to import it to the "productController.js" file.
```
				const ErrorHandler = require("../utils/errorhandler");
				// Get Product Details
				exports.getProductDetails = async (req, res, next)=>{
				    const product = await Product.findById(req.params.id);

				    if(!product){
				        return next(new ErrorHandler("Product not Found", 404));
				    }
		
				    res.status(200).json({
				        success: true,
			        	product
				    })
				}
```
	Now if you don't give a valid product id while finding it or getting it then it will display the error accordingly

___________________________________________Handling Async Errors_________________________________________________

It is a good practice to write .then and .catch inside async await functions. To avoid writing .then and .catch again and again inside the product controller we'll make an error handler for it

Step 39: Make a new file inside the "middleware" named "catchAsynErrors.js" and add the following code into it.
```
				const catchAsyncErrors = theFunc => (req, res, next) => {
				    Promise.resolve(theFunc(req, res, next)).catch(next);
				}

				module.exports = catchAsyncErrors;
```			
step 40: Import it inside "productController.js".
```
				const catchAsyncErrors = require("../middleware/catchAsyncErrors");
```
Step 41: Now update the "productController.js".
```

	const Product = require("../models/productModel");
	const ErrorHandler = require("../utils/errorhandler");
	const catchAsyncErrors = require("../middleware/catchAsyncErrors");

	// Create Product --- Admin

	exports.createProduct = catchAsyncErrors(async (req, res, next)=> {
	    const product = await Product.create(req.body);

	    res.status(201).json({
	        success: true,
	        product
	    })
	});

	// Update Product --- Admin

	exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	    let product = Product.findById(req.params.id);

	    if(!product){
	        return res.status(500).json({
	            success:false,
	            message: "Product not found"
	        })
	    }
	
	    product = await Product.findByIdAndUpdate(req.params.id, req.body,
	        {
	            new: true,
	            runValidators: true,
	            userFindandModify: false
	        })
	
	    res.status(200).json({
	        success: true,
	        product
	    })	
	});
	
	// Delete Product --- Admin
	
	exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	    const product = await Product.findById(req.params.id);
	
	    if(!product){
	        return res.status(500).json({
	            success:false,
        	    message: "Product not found"
	        })
	    }
	
	    await product.remove();
	
	    res.status(200).json({
	        success: true,
	        message: "Product Deleted successfully"
	    })
	});
	
	// Get Product Details
	exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
	    const product = await Product.findById(req.params.id);
	
	    if(!product){
	        return next(new ErrorHandler("Product not Found", 404));
	    }
	
	    res.status(200).json({
	        success: true,
	        product
	    })
	});
	
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const products = await Product.find();
	
	    res.status(200).json(
	        {
	            success: true,
	            products
	        }
	    )
	});
```	
Now if you don't type the name or any required field while creating the product then it won't crash the server rather it will display the error

________________________________________________Unhandled Promise Rejection__________________________________________


If we change the "DB_URI"  inside the "config.env" file to "mongodb://localhost:27017/Ecommerce" then it will throw an error and to resolve this we can make the following changes inside the "server.js"
We have to crash the Server 

Step 42: Inside the "server.js" update the app.listen to the following
```
	const server = app.listen(process.env.PORT, ()=>{
	    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
	})
```
Step 43: Inside the "server.js" write the following code at the end
```
	// Unhandled Promsie Rejection

	process.on("unhandledRejection", err => {
	    console.log(`Error: ${err.message}`);
	    console.log("Shutting down the server due to unhanlded rejection");

	server.close(()=> {
        	process.exit(1);
	    })
	})
```
Step 44: Now you can remove the ".catch" method inside "database.js" and your " database.js" will look like.
```
	const mongoose = require("mongoose");

	const connectDatabase = ()=>{
	    mongoose.connect(process.env.DB_URI).then((data)=>{
	        console.log(`MongoDB connected with server: ${data.connection.host}`);
	    })
	}

	module.exports = connectDatabase;
```
___________________________________________Handling Uncaught Exception_________________________________________

If you type "console.log(youtube)" in your "server.js" then it will throw an error which says "youtube is not defined". These type of errors are called uncaught errors.

Step 45: Inside the "server.js" file at the top of the file, type the following code
```
	// Uncaught Exception Error
	process.on("uncaughtException", err=>{
	    console.log(`Error: ${err.message}`);
	    console.log("Shutting down the server due to uncaught exception");
	    process.exit(1);
	})
```

___________________________________________Handling Cast Error Mongodb_________________________________________
Step 46: If you give the less or more number of characters in the id then it will show you a cast error and to handle this error we can write the following code inside the "errorhandler.js" just below the line "err.message = err.message || "Internal Server Error";"
```
	// Mongodb Cast Error Handler
	    if(err.name === "CastError"){
	        const message = `Resource not found. Invalid ${err.path}`;
	        err = new ErrorHandler(message, 400);
	    }
```
___________________________________________Searching Products by Name_________________________________________
Step 47: Make a new file inside "utils" named "apifeatures.js" and add the following code into it.
```
	class ApiFeatures {
	    constructor(query, queryStr){
	        this.query = query;
	        this.queryStr = queryStr;
	    }

	    search(){
	        const keyword = this.queryStr.keyword ? {
	            // Got the keyword
	            name: {
	                // We are searching for the name of the product
	                $regex: this.queryStr.keyword,
	                $options : "i",
	            },
	        } : {};
	
	        this.query = this.query.find({...keyword});
	        return this;
	    }
	}
	
	module.exports = ApiFeatures;
```
Step 48: Update the "getAllProducts" section of "productController.js".
```
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const apiFeature = new ApiFeatures(Product.find(), req.query).search();
	    const products = await apiFeature.query;

	    res.status(200).json(
	        {
        	    success: true,
	            products
	        }
	    )
	});
```
__________________________________________Adding filter Section_______________________________________
Step 49: Add the following object below the search() object inside "ApiFeatures" class inside "apifeatures.js".
```
	    filter(){
	        const queryCopy = {...this.queryStr};
	        // Removing some fields for category
        	const removeFields = ["keyword", "page", "limit"];
	        removeFields.forEach(key=> {
	            delete queryCopy[key];
	        })

	        this.query = this.query.find(queryCopy);
	        return this;
	    }
```

Here we have made the copy of queryStr first and then stored the copy inside the queryCopy because we do not want to alter the real queryStr.
Also, the queryStr is an object which is {"category" : "something"} so no need to pass the queryCopy as an object inside this.query.find()
Also, this is case Sensitive so a category of "Laptop" will be searched as a "Laptop" only

Step 50: Update the "getAllProducts" of "productController.js".
```
	// Get All Products
	exports.getAllProducts = catchAsyncErrors(async (req, res) => {
	    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
	    const products = await apiFeature.query;
	
	    res.status(200).json(
	        {
	            success: true,
	            products
	        }
	    )
	});
```
_________________________________Filter for pricing and Rating________________________________________

Step 51: To add the pricing and rating, update the filter() inisde the "apifeatures.js" as.
```
	filter(){
	        const queryCopy = {...this.queryStr};
	        // Removing some fields for category
	        const removeFields = ["keyword", "page", "limit"];
	        removeFields.forEach((key)=> {
	            delete queryCopy[key];
	        })
	
	        // Filter for pricing and rating
	        let queryStr = JSON.stringify(queryCopy);
	        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`);

	        this.query = this.query.find(JSON.parse(queryStr));
	        return this;
	    }
```

Now you can go to the postman and type the following
			KEY				VALUE
			keyword				product
			category			Laptop
			price[gt]			1200
			price[lt]			2000

And this will filter the products for you
