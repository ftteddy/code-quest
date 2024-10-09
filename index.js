// IMPORT PKG
require('dotenv').config();
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser');
const express = require('express');

// EXPRESS SERVER CONFIG
const app = express();
const PORT = 2000;

// IMPORTING CODE FILE
const staticRoute = require('./staticRoute');
const userRoute = require('./routes/userAPI')
const apiRoute = require('./routes/apiRoute');
const {cookieCheker} = require('./middleware/authChecker');

// SETTING STUFF
mongoose.connect(process.env.MONGODB_LINK);
app.use(express.static('public'))
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MIDDLEWARE
app.use(cookieCheker);

// ROUTES   
app.use('/', staticRoute);
app.use('/user', userRoute);
app.use('/api', apiRoute);

// STARTING EXPRESS SARVER
app.listen(PORT, ()=>{console.log(`server start at ${PORT}`)});