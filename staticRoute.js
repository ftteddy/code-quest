const express = require('express');
const route = express.Router();

const {routeCookieCheker} = require('./middleware/authChecker');
const codeModule = require('./modules/codeModule');
const usermodule = require('./modules/userModule');
const commentModule = require('./modules/commentModule')

route.get('/', routeCookieCheker, (req, res)=>{
    return res.render('landingpage')
});

route.get('/singup', (req, res)=>{
    return res.render('singup');
});

route.get('/login', (req, res)=>{
    return res.render('login');
});

route.get('/openissue', (req, res)=>{
    return res.render('openissue');
});

route.get('/homepage', routeCookieCheker, async(req, res)=>{
    const userIsuuse = await codeModule.find({issueopen: req.user._id});
    const userProfile = await usermodule.findById(req.user._id);

    const allCode = await codeModule.find({});
    
    return res.render('homepage', {
        name: req.user.fullname, 
        bio: req.user.bio, 
        yourcode: userIsuuse, 
        allcode: allCode, 
        profileImage: userProfile.profileImage,
    });
});

route.get('/myissue', routeCookieCheker, async(req, res)=>{
    const userIsuuse = await codeModule.find({issueopen: req.user._id});
    const userProfile = await usermodule.findById(req.user._id);

    const allCode = await codeModule.find({});

    return res.render('myissue', {
        name: req.user.fullname, 
        bio: req.user.bio, 
        yourcode: userIsuuse, 
        allcode: allCode, 
        profileImage: userProfile.profileImage,
    });
});

route.get('/codeopen/:slug', async(req, res)=>{
    const codeFinder = await codeModule.findOne({issueid: req.params.slug}) 
    const userFinderFromCode = await usermodule.findById(codeFinder.issueopen);
    
    const comment = await commentModule.find({codeId: codeFinder._id}).populate('issueById');

    const codefilenamemaker = `/code/${codeFinder.codefileoriginalname}`;

    return res.render('codeopen', {
        name: userFinderFromCode.fullname, 
        profileImage: userFinderFromCode.profileImage, 
        issuename: codeFinder.issuename, 
        codedes: codeFinder.issuedescription, 
        code: codeFinder.code,
        codefile: codefilenamemaker,
        issueMain: req.user._id,
        issuecodeid: userFinderFromCode._id,
        codedelete: req.params.slug,
        comments: comment,
    });
});

route.get('/setting', routeCookieCheker, async(req, res)=>{
    const userProfile = await usermodule.findById(req.user._id);

    return res.render('setting', {
        name: req.user.fullname, 
        bio: req.user.bio, 
        profileImage: userProfile.profileImage,
    });
});

route.post('/search', async(req, res)=>{
    const {searchCode} = req.body;
    try {
        const codeFindIssue = await codeModule.find({issuename: searchCode});
        const codeFindLanguages = await codeModule.find({languages: searchCode});

        return res.render('searchresultshow', {codeFinde: codeFindIssue, languages: codeFindLanguages});

    } catch (error) {
        console.log('search error:', error);
        return res.render('searchresultshow', {FindError: 'not found'});
    }
});

module.exports = route;