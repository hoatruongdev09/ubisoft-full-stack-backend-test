const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    name: String,
    startDate: { type: Date, default: Date.now },
    rewardedUsers: Array,
    endDate: Date,
    reward: {
        star: Number
    },
    enable: Boolean
})

module.exports = mongoose.model('Event', eventSchema)