const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const fs = require('fs');

mongoose.connect('mongodb://nayan:08kitunayan@ds119651.mlab.com:19651/shop');

app.use(morgan('dev', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Implement JSON body parser
app.use(bodyParser.json());

app.use((req,res, next) => {
    res.header('Access-Control-Access', '*');
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use('/user',userRoutes);
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req, res, next) => {
    const error = new Error("API not found");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    });

});


module.exports = app;