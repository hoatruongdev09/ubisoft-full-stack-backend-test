const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Game = require('../../models/game')
const Event = require('../../models/event')
const User = require('../../models/user')


router.get('/listAllGame', async (request, response, next) => {
    try {
        let games = (await Game.find()).filter(game => { if (game.enable) { return game } })
        response.status(200).json({ games: games })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.post('/create', async (request, response, next) => {
    const name = request.body.name
    const initialData = request.body.initialData
    if (name == "" || name == null || initialData == "" || initialData == null) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    const game = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        initialData: initialData,
        enable: true
    }
    try {
        await new Game(game).save()
        response.status(201).json({
            createdGame: game
        })
    } catch (err) {
        response.status(500).json({ message: error })
    }

})
router.delete('/delete', async (request, response, next) => {
    const gameId = request.body.id
    if (gameId == "" || gameId == null) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const game = await Game.findById(gameId)
        if (game == null || !game.enable) {
            response.status(404).json({ message: "Game is not found" })
            return
        }
        game.enable = false
        await game.save()
        response.status(200).json({ deletedGame: game })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.get('/info', async (request, response, next) => {
    const gameId = request.query.id
    if (gameId == "" || gameId == null) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const gameDocument = await Game.findById(gameId)
        if (gameDocument == null || !gameDocument.enable) {
            response.status(404).json({ message: "Game is not found" })
            return
        }
        const events = await Event.find({ game: new mongoose.Types.ObjectId(gameId), enable: true }).exec()
        let gameInfo = {
            _id: gameDocument.id,
            name: gameDocument.name,
            initialData: gameDocument.initialData,
            happeningEvent: events.filter(e => { return checkIfEventIsHappening(e) }),
            comingUpEvent: events.filter(e => { return checkIfEventIsComingUp(e) }),
        }
        response.status(200).json(gameInfo)

    } catch (err) {
        console.log(err)
        response.status(500).json({ message: err })
    }
})

function checkIfEventIsHappening(event) {
    const currentDate = Date.now()
    return currentDate - Date.parse(event.startDate) >= 0 && Date.parse(event.endDate) - currentDate > 0
}
function checkIfEventIsComingUp(event) {
    const currentDate = Date.now()
    return Date.parse(event.startDate) - currentDate > 0
}

module.exports = router