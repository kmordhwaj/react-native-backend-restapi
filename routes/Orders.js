const express = require("express");
const {Order} = require('./models/Order');

const router = express.Router();

// get all products
router.get('/', async (req, res) => {
    const orderList = await Order.find();
   
    if(!orderList){
        res.status(500).json({success:false});
    }
   
    res.send(orderList);
});

// post a product
router.post('/', (req, res) => {
    const order = new Order({
        name:req.body.name,
        image:req.body.image,
        countInStock:req.body.countInStock
    });
    order.save().then((createdOrder) => {
        res.status(201).json(createdOrder);
    }).catch((err) => {
        res.status(500).json({
            error:err,
            success:false
        })
    });
});

module.exports = router;