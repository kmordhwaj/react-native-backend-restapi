const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.options('*', cors());

const productsRoute = require('./routes/Products');
const categoriesRoute = require('./routes/Categories');
const usersRoute = require('./routes/Users');
const ordersRoute = require('./routes/Orders');
const authJwt = require("./helpers/Jwt");
const errorHandler = require("./helpers/ErrorHandler");

// starting the server
const app = express();

//initializing dotenv
dotenv.config();
// using data from dotenv
const mongourl = process.env.MONGO_URL;
const api = process.env.API_URL;

//middlewares
app.use(bodyParser.json()); // to parse json data
app.use(morgan('tiny'));  //to display our http requests
app.use(authJwt);

app.use(errorHandler);

app.use(`${api}/products`, productsRoute); //routers
app.use(`${api}/categories`, categoriesRoute); //routers
app.use(`${api}/orders`, ordersRoute); //routers
app.use(`${api}/users`, usersRoute); //routers

// starting mongodb server and connecting
mongoose.connect(mongourl, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'rnecom'
}).then(() => {
    console.log('connected to databse');
}).catch((err) => {
    console.log(err);
});

//listning on server
app.listen(3300, ()=> {
    console.log('our server is running now at http://localhost:3000 port');
});