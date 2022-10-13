const mongoose = require('mongoose')
// import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({}).add({
    id: String,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: Boolean,
    posts: [{type: String}]
})

// userSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.password)
// }

// userSchema.methods.generateHash = password => {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
// } 
module.exports = mongoose.model('User', userSchema)

// TODO - Faire ajout de bcrypt pour hash les passwords dans la DB