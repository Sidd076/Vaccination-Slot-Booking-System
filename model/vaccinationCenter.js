const mongoose = require('mongoose')


const centerSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    number: {
        type: Number,
    },
    slots: {
        type: Number,
        default: 10,
    },
})

module.exports = mongoose.model('vaccination-center', centerSchema)
