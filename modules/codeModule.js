const mongoose = require('mongoose');

const codeSchema  = mongoose.Schema({
    issueopen: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    issuename: {type: String, required: true},
    languages: {type: String, required: true},
    issuedescription: {type: String, required: true},
    code: {type: String, required: true},
    codefilename: {type: String},
    issueid: {type: String, required: true},
    codefileoriginalname: {type: String},
});

const codeModule = mongoose.model('code', codeSchema);
module.exports = codeModule;