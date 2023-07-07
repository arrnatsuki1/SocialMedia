const express = require('express')
const Logica = require('../Logica_De_Negocio/Logica')
const MessageController = express.Router()


MessageController.post('/createmessage', (req, res) => {
    const log = new Logica()
    log.crearPublicacion(req.cookies.uuid, req.body.message).then(
        (makeit) => {
            if (makeit) {
                res.status(200)
            } else {
                res.status(400)
            }
        }
    )
    res.send()
})

module.exports = MessageController
