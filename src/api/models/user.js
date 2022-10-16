const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')



const userSchema = new mongoose.Schema({}).add({
    id: String,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: Boolean,
    posts: [{type: String}]
})

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
} 
module.exports = mongoose.model('User', userSchema)

