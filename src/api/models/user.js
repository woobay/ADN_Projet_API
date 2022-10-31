const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({}).add({
    id: String,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
    created_at: {type: Date, required: true, default: Date.now},
    posts: [{type: String}]
})


module.exports = mongoose.model('User', userSchema)

