const express = require('express')
const router = express.Router()

router.get('', (request, response, next) => {
    response.status(200).render('game/index')
})

module.exports = router