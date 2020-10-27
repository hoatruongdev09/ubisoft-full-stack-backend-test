const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    initialData: {
        coin: Number,
        star: Number
    },
    enable: Boolean
})

module.exports = mongoose.model('Game', gameSchema)