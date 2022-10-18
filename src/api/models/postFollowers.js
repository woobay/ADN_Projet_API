const mongoose = require('mongoose')

const followersSchema = new mongoose.Schema({}).add({
    id: String,
    user_id: {type: String, required: true},
    post_id: {type: String, required: true},
})


module.exports = mongoose.model('Followers', followersSchema)
