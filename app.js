const express = require('express');
const app = express()
const path = require('path')
const cookie_parser = require('cookie-parser')

/**
 * My stuff
 */
const Connection = require('./DAO/Connection')
const Userdao = require('./DAO/UsuariosDAO')
const Usuario = require('./Dominio/User')
const Logica = require('./Logica_De_Negocio/Logica');

/**
 * App configuration
 */
app.use(express.urlencoded({ extended: false }))
app.use(cookie_parser())
app.set('view engine', 'ejs')
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

app.get('/', (req, res) => {
    if (req.cookies.uuid == undefined || req.cookies.uuid.length < 0) {
        res.render(
            'index',
        {loged: false});
    } else {
        res.render('./loged_pages/index', {loged: true})
    }
})

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
    let isLoged = req.cookies.uuid != undefined;
    logica.obtenerPerfilCompleto(username)
        .then(
            (info) => {
                res.render("Profile",
                    {
                        publications: info.pubs,
                        loged: isLoged,
                        userinfo: info.user
                    }
                )
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

app.get('/sign-up', checkForUuid, (req, res) => {
    res.render('sign-up')
})
/**
 * LA CANIJA DE MI HERMANANA ME DIJO QUE SI ESTO SE COMPLETA A LA PERFECCION
 * LA SESION TIENE QUE QUEDAR INICIADA Y TE TIENE QUE MANDAR A LA PAGINA DE INICIO
 */
app.post('/sign-up', (req, res) => {
    const logica = new Logica()
    logica.agregarUsuario(req).then(
        (result) => {
            if (result == null) {
                res.send("Error al intentar regitrar el usuario")
                return;
            }
            res.cookie('uuid', result)
            res.send(`
                <script>
                    alert('se registro con exito')
                    window.location = '/'
                </script>
            `)
        }
    ).catch((err) => {
        if (err.name == "UsuarioExistenteError") {
            res.send("El usuario que desea agregar ya existe")
        } else {
            res.send(`
            <script>
                alert("Hubo un error con los servidores, por favor intentelo mas tarde")
                window.location = '/sign-up'
            </script>
            `)
        }
    })
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
        }
    )
    log.obtenerTodasLasPublicacionesPorUuid(req.cookies.uuid).then(
        (pubs) => {
            res.render('Profile', { publications: pubs, loged: true, userinfo: user })
        }
    ).catch((err) => {
        res.render('./loged_pages/index')
    })
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

app.post('/createmessage', (req, res) => {
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

app.get('/buscador/:like', (req, res) => {
    const like = req.params.like
    const logica = new Logica()
    logica.buscarUsuariosConUsuarioSimilar(like).then((value)=>{
        res.render(
            'people', {people: value, loged: req.cookies.uuid!=undefined ? true : false}
        )
    })
})

const port = 8080
app.listen(port, () => {
    console.log(`listening at port ${port}`)
})