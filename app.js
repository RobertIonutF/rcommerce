const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/rcommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;