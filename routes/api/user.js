const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const User = require('../../models/user.js')
const Game = require('../../models/game')

router.post('/create', async (request, response, next) => {
    const name = request.body.name
    if (!name) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const user = {
            _id: new mongoose.Types.ObjectId(),
            name: name,
            recentLoginTime: new Date(Date.now()).toISOString(),
            gameData: [],
            enable: true
        }
        try {
            await new User(user).save()
            response.status(201).json({ createdUser: user })
        } catch (err) {
            response.status(500).json({ message: err })
        }
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.get('/get', async (request, response, next) => {
    const userId = request.query.id
    if (!userId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            response.status(404).json({ message: "user not found" })
            return
        }
        response.status(200).json({
            _id: user._id,
            name: user.name,
            recentLoginTime: user.recentLoginTime,
            gameData: user.gamesData
        })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.delete('/delete', async (request, response, next) => {
    const userId = request.body.id
    if (!userId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            response.status(404).json({ message: "user not found" })
            return
        }
        user.enable = false
        await user.save()
        response.status(200).json({ deletedUser: user })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})
router.get('/listAllUser', async (request, response, next) => {
    try {
        const users = await (await User.find()).filter(user => { if (user.enable) { return user } })
        response.status(200).json({ users: users })
    } catch (err) {
        response.status(500).json({ message: err })
    }
})


router.post('/registerGame', async (request, response, next) => {
    const userId = request.body.userId
    const gameId = request.body.gameId
    if (!userId || !gameId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        let user = await User.findById(userId)
        if (!user || !user.enable) {
            response.status(404).json({ message: "user is not found" })
            return
        }
        if (!user.gamesData) { user.gamesData = [] }
        let gameData = user.gamesData.find(game => game._id == gameId)
        if (gameData) {
            response.status(400).json({ message: "user registered this game" })
            return
        }
        let game = await Game.findById(gameId)
        if (game == null || !game.enable) {
            response.status(404).json({ message: "game is not found" })
        }
        user.gamesData.push({
            _id: new mongoose.Types.ObjectId(gameId),
            data: game.initialData
        })
        user.recentLoginTime = new Date(Date.now()).toISOString()
        await user.save()
        response.status(200).json({
            _id: user._id,
            name: user.name,
            recentLoginTime: user.recentLoginTime,
            gameData: {
                _id: gameId,
                data: game.initialData
            }
        })
    } catch (err) {
        console.log(err)
        response.status(500).json({ message: err })
    }
})
router.patch('/updateUserGameData', async (request, response, next) => {
    const userId = request.body.userId
    const gameId = request.body.gameId
    const gameData = request.body.gameData
    if (!userId || !gameId || !gameData || isNaN(gameData.coin) || isNaN(gameData.star)) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        let user = await User.findById(userId)
        if (!user || !user.enable) {
            response.status(404).json({ message: "user not found" })
            return
        }
        if (!user.gamesData || user.gamesData.length == 0) {
            user.gamesData = []
            user.gamesData.push({ _id: new mongoose.Types.ObjectId(gameId), data: gameData })
            await user.save()
        } else {
            for (let i = 0; i < user.gamesData.length; i++) {
                if (user.gamesData[i]._id == gameId) {
                    user.gamesData.splice(i, 1)
                    break
                }
            }
            user.gamesData.push({ _id: new mongoose.Types.ObjectId(gameId), data: gameData })
            await user.save()
        }
        response.status(200).json({
            _id: user._id,
            name: user.name,
            recentLoginTime: user.recentLoginTime,
            gameData: {
                _id: gameId,
                data: gameData
            }
        })
    } catch (err) {
        console.log("error 1: ", err)
        response.status(500).json({ message: err })
    }
})
router.get('/getUserGameData', async (request, response, next) => {
    const userId = request.query.userId
    const gameId = request.query.gameId
    if (!userId || !gameId) {
        response.status(400).json({ message: "Parameter is not valid" })
        return
    }
    try {
        let user = await User.findById(userId)
        console.log('user: ', user)
        if (user == null || !user.enable) {
            response.status(404).json({ message: "user not found" })
            return
        }
        if (user.gamesData == null) {
            response.status(400).json({ message: "user didn't play any game" })
            return
        }
        let game = user.gamesData.find(gameData => gameData._id == gameId)
        if (game == null) {
            response.status(400).json({ message: "user didn't play this game" })
            return
        }
        response.status(200).json({
            _id: user._id,
            name: user.name,
            recentLoginTime: user.recentLoginTime,
            gameData: {
                _id: game._id,
                data: game.data
            }
        })

    } catch (err) {
        response.status(500).json({ message: err })
    }
})

module.exports = router