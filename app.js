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
const webEventRoutes = require('./routes/web/events')
const app = express()

const connectionString = `mongodb+srv://test26102020:strongPassword123@ubisoft-gameportal-test.1ggep.mongodb.net/portal_game_test?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// mongoose.connect(`mongodb://localhost:27017/portal_game_test`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', homeRoutes)
app.use('/web', homeRoutes)
app.use('/web/user', webUserRoutes)
app.use('/web/game', webGameRoutes)
app.use('/web/event', webEventRoutes)

app.use('/api/game', gameRoutes)
app.use('/api/event', eventRoutes)
app.use('/api/user', userRoutes)

module.exports = app
