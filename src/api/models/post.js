const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({}).add({
    id: String,
    title: {type: String, required: true},
    pictures: [{
        data: [Buffer],
        contentType: String,
        filename: String,
        }],
    resume: {type: String, required: true},
    description: {type: String, required: true},
    city: {type: String, optional: true},
    created_at: {type: Date, required: true, default: Date.now},
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true}
})


module.exports = mongoose.model('Post', postSchema)
