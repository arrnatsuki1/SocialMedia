async function esMiAmigo() {
    let nombreUsuario = document.getElementById('header-profile-information-username').textContent
    nombreUsuario = nombreUsuario.slice(1, nombreUsuario.length )
    const response = await fetch('/userinfo/friends/'+nombreUsuario)
    const json = await response.json()
    return json.esMiAmigo
}

await function loSigo() {
    let nombreUsuario = document.getElementById('header-profile-information-username').textContent
    nombreUsuario = nombreUsuario.slice(1, nombreUsuario.length )
    const response = await fetch('/userinfo/follow/'+nombreUsuario)
    const json = await response.json()
    return json.esMiAmigo
}

async function configurarBotones() {
    if(await esMiAmigo()) {
        seguirbutton.disabled = true
        solicitudbutton.disabled = true
    } else if( )
}

const seguirbutton = document.getElementById('seguir')
const solicitudbutton = document.getElementById('solicitud')


configurarBotones()