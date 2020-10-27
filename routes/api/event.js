const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Event = require('../../models/event.js')
const Game = require('../../models/game.js')
const User = require('../../models/user')

router.get('/rewardPlayer', async (request, response, next) => {
    const userId = request.query.userId
    const eventId = request.query.eventId
    if (!userId || !userId) {
        response.status(400).json({ message: "parameter not valid" })
        return
    }
    try {
        const event = await Event.findById(eventId)
        if (!event || !event.enable) {
            response.status(404).json({ message: "event is not found" })
            return
        }
        if (!checkIfEventIsComplete(event)) {
            response.status(400).json({ message: "event is not complete" })
            return
        }
        const user = await User.findById(userId)
        if (!user || !user.enable) {
            response.status(404).json({ message: "user is not found" })
            return
        }
        if (!event.rewardedUsers) { event.rewardedUsers = [] }
        if (event.rewardedUsers.includes(userId)) {
            response.status(400).json({ message: "user received the reward" })
            return
        }
        console.log(user.gamesData)
        console.log(event)
        let game = null
        for (let i = 0; i < user.gamesData.length; i++) {
            if (user.gamesData[i]._id.equals((event.game))) {
                game = user.gamesData[i]
                user.gamesData.splice(i, 1)
                break
            }
        }
        if (!game) {
            response.status(400).json({ message: "user didn't play this game" })
            return
        }
        game.data.star += event.reward.star
        user.gamesData.push(game)
        await user.save()
        event.rewardedUsers.push(user._id)
        await event.save()
        response.status(200).json({
            _id: user._id,
            name: user.name,
            recentLoginTime: user.recentLoginTime,
            reward: event.reward,
            gameData: game
        })

    } catch (err) {
        console.log(err)
        response.status(500).json({ message: err })
    }
})

router.get('/get', async (request, response, next) => {
    const eventId = request.query.eventId
    if (!eventId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const event = await Event.findById(eventId)
        if (!event || !event.enable) {
            response.status(404).json({ message: "Event is not found" })
            return
        }
        response.status(200).json(event)
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.delete('/delete', async (request, response, next) => {
    const eventId = request.body.eventId
    if (!eventId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const event = await Event.findById(eventId)
        if (!event || !event.enable) {
            response.status(404).json({ message: "Event is not found" })
            return
        }
        event.enable = false
        await event.save()
        response.status(200).json({ deletedEvent: event })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.post('/create', async (request, response, next) => {
    const gameId = request.body.gameId
    const startDate = request.body.startDate
    const endDate = request.body.endDate
    const rewardStar = request.body.rewardStar
    const name = request.body.name
    console.log(`${name} ${rewardStar} ${startDate} ${endDate} ${gameId}`)
    if (!gameId || !endDate || !rewardStar || !name) {
        response.status(400).json({ message: "parameter not valid" })
        return
    }
    try {
        const gameDoc = await Game.findById(gameId)
        if (gameDoc == null || !gameDoc.enable) {
            response.status(404).json({ message: "game is not found" })
            return
        }
        if (endDate - startDate <= 0) {
            response.status(400).json({ message: "Event end date must bigger then start date" })
            return
        }
        const event = {
            _id: new mongoose.Types.ObjectId(),
            name: name,
            game: gameId,
            startDate: (startDate == "" || startDate == null) ? new Date(Date.now()).toISOString() : new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            rewardedUser: [],
            reward: {
                star: rewardStar
            },
            enable: true
        }
        await new Event(event).save()
        response.status(201).json({ createdEvent: event })
    } catch (err) {
        console.log("error 2: ", err)
        response.status(500).json({ message: err })
    }

})
router.get('/listAllEvent', async (request, response, next) => {
    try {
        const events = (await Event.find()).filter(event => { if (event.enable) { return event } })
        response.status(200).json({ events: events })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
function checkIfEventIsComplete(event) {
    return Date.parse(event.endDate) - Date.now() < 0
}
module.exports = router