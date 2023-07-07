function checkForUuid(req, res, next) {
    if (req.cookies.uuid == null || typeof req.cookies.uuid == undefined) {
        next()
    } else {
        res.send(`
            <script>
                window.location = '/'
            </script>
        `)
    }
}

module.exports = checkForUuid