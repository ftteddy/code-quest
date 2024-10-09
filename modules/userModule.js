const mongoose = require('mongoose');

const userSchema  = mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImage: {type: String, default: "/profile/defult-profile-image.jpg"},
    phonenumber: {type: String},
    bio: {type: String},
});

const userModule = mongoose.model('user', userSchema);
module.exports = userModule;