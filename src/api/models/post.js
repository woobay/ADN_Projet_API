const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({}).add({
    id: String,
    title: {type: String, required: true},
    pictures: {type: [String], optional: true, default: []},
    resume: {type: String, required: true},
    description: {type: String, required: true},
    created_at: {type: Date, required: true, default: Date.now},
    created_by: {type: String, required: true}
})


module.exports = mongoose.model('Post', postSchema)
