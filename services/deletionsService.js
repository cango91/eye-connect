const { ObjectId } = require('mongoose').Types
const Deletion = require('../models/deletetion');

const deleteId = async (schema, id) => {
    try {
        let deletion;
        deletion = await Deletion.findOne({ schema: schema.toLowerCase() });
        if (!deletion) {
            deletion = new Deletion({
                schema: schema.toLowerCase(),
                deletedId: []
            });
            await deletion.save();
        }
        deletion.updateOne({ $push: { 'deletedId': id instanceof ObjectId ? id : new ObjectId(id) } });
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const get = async (schema,id) =>{
    try {
        const deletion = await Deletion.findOne({schema:schema.toLowerCase()});
        id = id instanceof ObjectId ? id : new ObjectId(id);
        if(!deletion) throw new Error(`No deletion record for ${schema} schema exists`);
        if(!deletion.deletedId.includes(id)) throw new Error(`No deletion record for ${id.toString()} found in ${schema} schema`);
        return `<${schema.toLowerCase().replace(/^(.)/, (_,group)=>group.toUpperCase())} deleted>`
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    delete: deleteId,
    get
}