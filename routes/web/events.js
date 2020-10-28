const express = require('express')
const router = express.Router()

router.get('', (request, response, next) => {
    response.status(200).render('event/index')
})

module.exports = router