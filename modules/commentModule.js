const mongoose = require('mongoose');

const commentSchema  = mongoose.Schema({
    issueById: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    codeId: {type: mongoose.Schema.Types.ObjectId, ref: 'codes'},
    comment: {type: String, required: true},
});

const commentModule = mongoose.model('comment', commentSchema);
module.exports = commentModule;