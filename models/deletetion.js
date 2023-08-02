const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const deletionSchema = new Schema({
    schema: String,
    deletedId: [mongoose.Types.ObjectId]
},
    { timestamps: true });

module.exports = mongoose.model('Deletion', deletionSchema);