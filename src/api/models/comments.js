const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({}).add({
    id: String,
    user_id: {type: String, required: true},
    post_id: {type: String, required: true},
    comments: [{type: String}]

})


module.exports = mongoose.model('Comments', commentSchema)
