const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

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
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    const products = await apiFeature.query;

    res.status(200).json(
        {
            success: true,
            products
        }
    )
});

