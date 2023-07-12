const express = require('express')
const Logica = require('../Logica_De_Negocio/Logica')
const router = express.Router()


router.get('/friends/:username', (req, res)=>{
    const username = req.params.username
    const log = new Logica()
    log.esMiAmigo(username, req.cookies.uuid)
    .then((esMiAmigo) => {
        res.header("Content-Type", "application/json")
        res.status(200).send(JSON.stringify({esMiAmigo: esMiAmigo}))
    }).catch((err)=>{
        console.log(err)
        res.status(400).send(err)
    })
})

router.get('/follow/:username', (req, res)=>{
    const username = req.params.username
    const log = new Logica()
    log.loSigo(username, req.cookies.uuid)
    .then((esMiAmigo) => {
        res.header("Content-Type", "application/json")
        res.status(200).send(JSON.stringify({esMiAmigo: esMiAmigo}))
    }).catch((err)=>{
        console.log(err)
        res.status(400).send(err)
    })
})

module.exports = router