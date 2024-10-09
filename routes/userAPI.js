const bcrypt = require('bcrypt');
const express = require('express');
const route = express.Router();

const multer = require('multer');
const profileStorage = require('../services/multerProfile');
const upload = multer({ storage: profileStorage });

const usermodule = require('../modules/userModule');
const { tokenSign, tokenVerify } = require('../services/auth');

route.post('/singup', upload.single('profileImage'), (req, res)=>{
    const hashSalt  = 10;
    const {fullname, email, password, confirmpassword} = req.body;
    
    if(!fullname || !email || !password || !confirmpassword) { return  res.render('singup')};
    if(password !== confirmpassword){ return res.render('singup', {errorTag: 'Both Password Dose Not Match'})}


    try {
        bcrypt.hash(password, hashSalt, async function(err, hash) {
            if(req.file){
                const profileImageDbPath = `/profile/${req.file.originalname}`;
                await usermodule.create({fullname, email, password: hash, profileImage: profileImageDbPath});
                return res.render('login');
            } else{
                await usermodule.create({fullname, email, password: hash});
                return res.render('login');
            }
        });
    } catch(error) {
        console.log('password hash problem', error);
    }
});

route.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) {return res.render('login', {errorTag: "full fill Email and Password Fild!"})};

    const userFindEmail = await usermodule.findOne({email});
    if(!userFindEmail) {return res.render('login', {errorTag: "Email is Wrong"})};

    const hsahPasswordCheck = await bcrypt.compare(password, userFindEmail.password);

    if(hsahPasswordCheck){
        const signToken = tokenSign(userFindEmail);
        return res.cookie('token', signToken).redirect('/homepage');
    } else {
        return res.render('login', {errorTag: "Password is Wrong"});
    }
});

module.exports = route;