const express = require('express')
const { request, response } = require('../../app')
const router = express.Router()

router.get('', (request, response, next) => {
    response.status(200).render('user/index')
})

module.exports = router