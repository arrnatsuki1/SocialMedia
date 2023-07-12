const express = require('express');
const multer = require('multer')
const app = express()
const path = require('path')
const cookie_parser = require('cookie-parser')

/*
 * ELO WORLLDD
 * im rosita from neovimmmm
 * */

require('dotenv').config()

/**
 * My stuff
 */
const Logica = require('./Logica_De_Negocio/Logica');
const multerStorage = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, "/public/upload/userpicture"),
        filename: (req, file, cb) => {
            const fileType = path.extname(file.originalname);
            let name = file.originalname.split(fileType)[0];
            name = `${req.cookies.uuid}-${Date.now()}-${fileType}`;
            cb(null, name)
        }
    }),
    limits: {
        fileSize: 1 * 1024 * 1024 * 5 //5MBts Maximo
    }
})


/**
 * App configuration
 */

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/views', express.static(path.join(__dirname, '/views')))

/**
 * Tengo que crear alguna manera de 
 * en caso de que el usuario no tenga su identificador
 * mostrarle ciertas paginas nada mas, en caso contraio mostrale otras
 * quiza con esto ya pueden existir paginas que solo ciertos identificadores pueden ver
 * pero seria mas seguro que esa informacion se guarde en el servidor 
 * y no en el cliente
 */

const HomeController = require('./Controllers/HomeController')
const SigupController = require('./Controllers/SignupController');
const MessageController = require('./Controllers/MessageController')
const UserController = require('./Controllers/UserController')
//Homepage
app.use('/', HomeController)
app.use('/sign-up', SigupController)
app.use('/message', MessageController)
app.use('/userinfo', UserController)

//

app.get('/logout', (req, res) => {
    if (req.cookies.uuid == undefined || req.cookies.uuid.length == 0) {
        res.send(`
            <script>
                alert("aun no ha iniciado sesion")
                window.location = '/login'
            </script>
        `)
    } else {
        res.clearCookie('uuid')
        res.send(`
            <script>
                alert("sesion cerrada con exito")
                window.location = '/'
            </script>
        `)
    }
})

/**
 * De preferencia cambiar el metodo a POST
 */
app.get('/user/:userName', (req, res) => {
    const username = req.params.userName
    const logica = new Logica()
    let isLogged = req.cookies.uuid != undefined;
    logica.obtenerPerfilCompleto(username)
        .then(
            (info) => {
                if (info.user.id === req.cookies.uuid) {
                    res.send(`
                        <script>
                            window.location = '/profile'
                        </script>
                    `)
                } else {
                    res.render("Profile",
                        {
                            publications: info.pubs,
                            loged: isLogged,
                            userinfo: info.user,
                            propio: false
                        }
                    )
                }
            }
        ).catch((err) => {
            res.send(`
                <script>
                    alert("Hubo un error en la busqueda")
                    window.location = '/'
                </script>
            `)
        })
})

app.get('/login', checkForUuid, (req, res) => {
    res.render('LogIn')
})

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

/**
 * Que te mande a tu propio perfil
 */
app.get('/profile', (req, res) => {
    const log = new Logica()
    let user;
    log.obtenerPorUuid(req.cookies.uuid).then(
        (userinfo) => {
            user = userinfo
            log.obtenerTodasLasPublicacionesPorUuid(req.cookies.uuid).then(
                (pubs) => {
                    res.render('Profile', {
                        publications: pubs,
                        loged: true,
                        userinfo: user,
                        propio: true
                    })
                }
            ).catch((err) => {
                console.log(err)
                res.send(`
                <script>
                    alert("hubo un error al buscar tu perfil")
                    window.location = '/'
                </script>`)
            })
        }
    )

})

app.post('/login', (req, res) => {
    const logica = new Logica()
    logica.inicioDeSesion(req)
        .then((value) => {
            if (value == null) {
                res.send("El usuario no existe")
            } else {
                res.cookie('uuid', value.id)
                res.send(`
                <script>
                    window.location = '/'
                </script>
                `)
            }
        })
        .catch((err) => {
            res.send(err)
        })

})

/**
 * Aqui no ocupo el uuid porque viene en la cookie
 */
app.post('/pubs/:uuid', (req, res) => {
    const uuid = req.params.uuid
    const logica = new Logica()

    logica.traerPublicacionesDeAmigos(uuid)
        .then((pubs) => {
            res.send(
                pubs
            )
        }).catch((err) => {
            res.status(400).end()
        })
})

app.get('/buscador/:like', (req, res) => {
    const like = req.params.like
    const logica = new Logica()
    logica.buscarUsuariosConUsuarioSimilar(like).then((value) => {
        res.render(
            'people', { people: value, loged: req.cookies.uuid != undefined ? true : false }
        )
    })
})

/**
 * Necesito hacer un controlador para esto
 */
app.post('/profile', multerStorage.single('file'), (req, res) => {
    if(req.file == undefined) {
        res.status(400).send()
    } else {
        const log = new Logica()
        log.guardarImagenDePerfil(req.file.filename, req.cookies.uuid).then(
            () => {
                res.status(200).send(`<script>window.location = '/profile'</script>`)
            }
        )
    }
})

const port = process.env.PORT || 80
app.listen(port, () => {
    console.log(`listening at port ${port}`)
})
