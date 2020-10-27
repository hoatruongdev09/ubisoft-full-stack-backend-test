const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { response } = require("express")

const gameRoutes = require("./routes/api/game.js")
const eventRoutes = require("./routes/api/event")
const userRoutes = require('./routes/api/user')

const homeRoutes = require('./routes/web/home')
const webUserRoutes = require('./routes/web/user')
const webGameRoutes = require('./routes/web/game')

const app = express()

mongoose.connect("mongodb://localhost:27017/portal_game_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', homeRoutes)
app.use('/web/user', webUserRoutes)
app.use('/web/game', webGameRoutes)

app.use('/api/game', gameRoutes)
app.use('/api/event', eventRoutes)
app.use('/api/user', userRoutes)

module.exports = app
