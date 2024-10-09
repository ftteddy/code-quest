const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY

function tokenSign(user){
    if(!user) {return null};
    const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImage: user.profileImage,
        phonenumber: user.phonenumber,
        bio: user.bio,
    };
    if(!payload) {return null};

    const options = {
        expiresIn: '30d' 
    };

    const jwtSign = jwt.sign(payload, jwtKey, options);
    return jwtSign;
}

function tokenVerify(token){
    if(!token) {return null};
    const jwtVerify = jwt.verify(token, jwtKey);
    return jwtVerify;
};

module.exports = {
    tokenSign,
    tokenVerify
}

