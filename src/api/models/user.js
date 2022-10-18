const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({}).add({
    id: String,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: Boolean,
    posts: [{type: String}]
})


module.exports = mongoose.model('User', userSchema)

