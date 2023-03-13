const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    number: {
        type: Number,
    },
    role: {
        type: String,
    },
},{timestamps: true})

module.exports = mongoose.model('user', userSchema)
