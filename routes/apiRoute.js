const express = require('express');
const route = express.Router();

const multer = require('multer');
const codeStorage = require('../services/multerCode');
const upload = multer({ storage: codeStorage });

const shortid = require('shortid');

const usermodule = require('../modules/userModule');
const codeModule = require('../modules/codeModule');
const commentModule = require('../modules/commentModule');
const {tokenSign} = require('../services/auth');

route.get('/logout', (req, res)=>{
    const token = "token"
    return res.clearCookie(token).render('landingpage');
});

route.get('/profile', (req, res)=>{
    return res.render('editprofile', {name: req.user.fullname});
});

route.get('/home', (req, res)=>{
    return res.redirect('/homepage')
});

route.post('/editprofile', async(req, res)=>{
    const token = "token";
    const {name, bio, phone} = req.body;

    if(name){
        await usermodule.findOneAndUpdate({email: req.user.email}, {$set: {fullname: name}})
    }
    if(bio){
        await usermodule.findOneAndUpdate({email: req.user.email}, {$set: {bio: bio}})
    }
    if(phone){
        await usermodule.findOneAndUpdate({email: req.user.email}, {$set: {phonenumber: phone}})
    }

    const cookieContent = await usermodule.findOne({email: req.user.email});
    const cookieTokenSign = tokenSign(cookieContent) 
    return res.clearCookie(token).cookie(token, cookieTokenSign).redirect('/homepage')
});

route.post('/submitissue', upload.single('codeFile'), async(req, res)=>{
    const {issueName, issueDescription, code, language} = req.body;
    const randomid = shortid.generate();

    const filenamestorage = `${req.user._id}-${req.file.originalname}`;
    console.log(filenamestorage);

    try {
        await codeModule.create({
            issueopen: req.user._id, 
            issuename: issueName, 
            issuedescription: issueDescription, 
            code: code, 
            codefilename: req.file.path, 
            codefileoriginalname: filenamestorage,
            issueid: randomid, 
            languages: language});

        return res.redirect('/homepage')

    } catch (error) {
        console.log('error code opner:', error);
        res.render('openissue');
    }
});

route.get('/delete/:slug', async(req, res)=>{
    const codeId = req.params.slug;
    await codeModule.findOneAndDelete({issueid: codeId});
    return res.redirect('/homepage');
});

route.post('/comment/:slug', async(req, res)=>{
    const codeid = req.params.slug;
    const {content} = req.body;

    const codeID = await codeModule.findOne({issueid: codeid});
    await commentModule.create({issueById: req.user._id, codeId: codeID, comment: content});

    return res.redirect(`/codeopen/${codeid}`);
});

module.exports = route;
