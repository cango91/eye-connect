const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    action: String,
    userId: mongoose.Types.ObjectId
},
{
    timestamps: true,
});

module.exports = mongoose.model('CRUDLog',logSchema);