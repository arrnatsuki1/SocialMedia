const express = require('express')
const uuidcheck = require('../utils/uuidcheck')
const Logica = require('../Logica_De_Negocio/Logica')
const SignupController = express.Router()

SignupController.get('/', uuidcheck, (req, res) => {
    res.render('sign-up')
})

SignupController.post('/', (req, res) => {
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

module.exports = SignupController