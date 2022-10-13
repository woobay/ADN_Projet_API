const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({}).add({
    id: String,
    title: {type: String, required: true},
    pictures: {type: [String], optional: true, default: []},
    description: {type: String, required: true},
    supported_by: [{type: String}],
    created_at: {type: Date, required: true, default: Date.now},
    created_by: {type: String, required: true}
})


module.exports = mongoose.model('Post', postSchema)
