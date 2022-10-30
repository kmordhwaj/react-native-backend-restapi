const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {User} = require('./models/User.js');

const router = express.Router();

// get all users
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash'); // without user password
                                    //.select('name phone email'); // if admin want to know only
                                                                   // these details.
    if(!userList){
        res.status(500).json({success:false});
    }
   
    res.send(userList);
});

// get a user by id (by async await method)
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
   
    if(!user){
        res.status(500).json({success:false, message:"The user with given id is not found"});
    }
   
    res.status(200).send(user);
});

// register a user
router.post('/register', (req, res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash: bcrypt.hashSync( req.body.password, 10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,       
    });
    user.save().then((createdUser) => {
        res.status(201).json(createdUser);
    }).catch((err) => {
        res.status(500).json({
            error:err,
            success:false
        })
    });
});

// login a user 
router.post('/login', async (req, res) => {
    const user = await User.findOne({email:req.body.email});
    const secret = process.env.SECRET_JWT;

    if (!user){
        return res.status(400).send('The user not found!');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            // payload object taken by sign method
            {
              userId: user.id    //(what we want to send with token) 
            },
            secret,   // secret key we want to send with token
            {expiresIn:'1d'}  // '1w' , '1m'
            );

        res.status(200).send({user:user.email, token: token});
    } else {
        res.status(401).send('Password is wrong!');
    }
});

module.exports = router;