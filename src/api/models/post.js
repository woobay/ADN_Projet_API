const mongoose = require('mongoose')
const nodemon = require('nodemon')

const postSchema = new mongoose.Schema({}).add({
    title: {type: String, required: true},
    pictures: [{
        type: String
        }],
    resume: {type: String, required: true},
    description: {type: String, required: true},
    country: {type: String, optional: true},
    created_at: {type: Date, required: true, default: Date.now},
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true},
    followers: [{
        username: {type: String, required: true},
        user_id: {type: String, required: true},
        }],
    comments: [{
        user_id: {type: String, required: true},
        username: {type: String, required: true},
        comment: {type: String, required: true},
    }],
    reports: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        }
    ],
})

module.exports = mongoose.model('Post', postSchema)
