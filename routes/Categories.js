const express = require("express");
const { Category } = require('./models/Category');

const router = express.Router();

// post a category (by async await method)
router.post('/', async (req, res) => {
    let category = new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
        image:req.body.image
    });

    category = await category.save();

    if (!category){
        return res.status(404).send('the category cannot be created');
    }

    res.status(200).send(category);
});

// update a category by id (by async await method)
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, 
        {
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
        image:req.body.image
        },
        {new:true}
        );
   
    if(!category){
        res.status(500).json({success:false, message:"The category cannot be updated"});
    }
   
    res.status(200).send(category);
});

// deleting a category (by promise method)
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then((category) =>{
        if (category){
            return res.status(200).json({success:true, message:"this category is deleted"});
        } else {
            return res.status(404).json({success:false,message:"can't find category to delete"});
        }
    }).catch((err) => {
        return res.status(404).json({success:false,error:err});
    })
});

// get all categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find();
   
    if(!categoryList){
        res.status(500).json({success:false});
    }
   
    res.status(200).send(categoryList);
});

// get a category by id (by async await method)
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
   
    if(!category){
        res.status(500).json({success:false, message:"The category with given id is not found"});
    }
   
    res.status(200).send(category);
});

module.exports = router;