const { tokenVerify } = require('../services/auth');

function cookieCheker(req, res, next){
    const tokenCookie  = req.cookies.token
    const tokenChecking = tokenVerify(tokenCookie);

    req.user = tokenChecking;
    next();
}

function routeCookieCheker(req, res, next){
    const tokenCookie  = req.cookies.token
    if(!tokenCookie) { return res.render('landingpage')};

    const tokenChecking = tokenVerify(tokenCookie);
    if(!tokenChecking) { return res.render('landingpage')};
    
    req.user = tokenChecking;
    next();
}

module.exports = {
    cookieCheker,
    routeCookieCheker
}