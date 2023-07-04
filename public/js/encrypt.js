import { isEmpty, hasWhitespaces } from "./verifyStrings.js"
import { SHA256 } from './sha256.js'

/**
 * Metodo para confirmar que los datos del usuario estan de forma correcta
 * regresa verdadero en caso de que no haya ningun error, falso en caso contrario
 * @returns Boolean
 */
function userVerify() {
    const logErrors = []
    const username = document.getElementById('username').value
    let user;
    const password = document.getElementById('password').value

    try {
        user = document.getElementById('name').value
        if(user == undefined || isEmpty(user)){
            logErrors[logErrors.length] = "El nombre no puede estar vacio"
        }
    } catch (err) {
        //just ignore
    }
    if (hasWhitespaces(username)) {
        logErrors[logErrors.length] = "el nombre de usuario no puede tener espacios"
    } else if (isEmpty(username) || isEmpty(password)) {
        logErrors[logErrors.length] = "nombre de usuario \n" +
            "o la contraseña esta vacio"
    }
    for (let i = 0; i < logErrors.length; i++) {
        alert(logErrors[i])
    }

    return logErrors.length == 0
}

function onClick() {

    if (!userVerify()) {
        return
    }

    const text = document.getElementById("password").value
    const form = document.getElementById('form')
    SHA256(text)
        .then((hash) => {
            document.getElementById('password').value = hash
            form.submit()
        }).catch((err) => {
            alert(err)
        })
}

window.addEventListener('load', () => {
    const button = document.getElementById('avanzar')
    button.onclick = onClick;
})