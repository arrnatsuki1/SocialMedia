const express = require('express')
const HomeController = express.Router()

HomeController.get("/", (req, res) => {
    if (req.cookies.uuid == undefined || req.cookies.uuid.length < 0) {
        res.render(
            'index',
        {loged: false});
    } else {
        res.render('./loged_pages/index', {loged: true})
    }
})

module.exports = HomeController