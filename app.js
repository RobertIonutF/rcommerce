const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
app.use(express.json());

const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const addressRouter = require('./routes/addressRouter');

//Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/addresses', addressRouter);


//Database connection
mongoose.connect("mongodb://localhost:27017/rcommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Server
app.listen(port, () => console.log(`Server started on port ${port}`));
module.exports = app;