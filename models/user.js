const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    recentLoginTime: Date,
    gamesData: Array,
    enable: Boolean
})

module.exports = mongoose.model('User', userSchema)