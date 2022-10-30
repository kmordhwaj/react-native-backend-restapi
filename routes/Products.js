const express = require("express");
const mongoose = require("mongoose");
const { Product } = require('./models/Product');
const { Category } = require('./models/Category');

const router = express.Router();

// post a product (by async await method)
router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category){
        return res.status(400).send('Invalid category');
    }

    let product = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
    });

    product = await product.save();

    if (!product){
        return res.status(404).send('the product cannot be created');
    }

    res.status(200).send(product);
});

// update a product by id (by async await method)
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category){
        return res.status(400).send('Invalid category');
    }

    const product = await Product.findByIdAndUpdate(req.params.id, 
        {
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured,
        },
        {new:true}
        );
   
    if(!product){
        res.status(500).json({success:false, message:"The category cannot be updated"});
    }
   
    res.status(200).send(product);
});

// deleting a product (by promise method)
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then((product) =>{
        if (product){
            return res.status(200).json({success:true, message:"this product is deleted"});
        } else {
            return res.status(404).json({success:false,message:"can't find product to delete"});
        }
    }).catch((err) => {
        return res.status(404).json({success:false,error:err});
    })
});

// get all product (for user)
router.get('/', async (req, res) => {
    const productList = await Product.find()
   // .select('name image -_id')    // to display only these things from all list
   // .populate('category') // to display all details of category not only the id, here 'category'
                            // coming from schema of product where category field is given a objectId 
   ;
   
    if(!productList){
        res.status(500).json({success:false});
    }
   
    res.status(200).send(productList);
});

// get a product by id (by async await method)
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
   
    if(!product){
        res.status(500).json({success:false, message:"The product with given id is not found"});
    }
   
    res.status(200).send(product);
});

// admin want to know how many product he had listed (to modify later)
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);
   
    if(!productCount){
        res.status(500).json({success:false});
    }
   
    res.status(200).send({
        productCount:productCount
    });
});

// featured products
router.get('/get/featured', async (req, res) => {
    const products = await Product.find({featured:true});
   
    if(!products){
        res.status(500).json({success:false});
    }
   
    res.status(200).send(products);
});

// featured products (show 'count' numbers of products only ) (user give some input)
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0 ;
    const products = await Product.find({featured:true}).limit(+count) ;  // here count is string and limit
                                                                          // take a int so + make
                                                                          // it int
    if(!products){
        res.status(500).json({success:false});
    }
   
    res.status(200).send(products);
});

// get products by categories (can use as filter)
   // localhost:3300/api/v1/products?categories=234566,456787
router.get('/', async (req, res) => {
  
    let filter = {};
    if (req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category') ;
   
    if(!productList){
        res.status(500).json({success:false});
    }
   
    res.status(200).send(productList);
});

module.exports = router;