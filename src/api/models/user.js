const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({}).add({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    admin: {type: Boolean, default: false},
    created_at: {type: Date, required: true, default: Date.now},
    posts: [{type: String}],
    email_confirm: {type: Boolean, default: true}
})

module.exports = mongoose.model('User', userSchema)
