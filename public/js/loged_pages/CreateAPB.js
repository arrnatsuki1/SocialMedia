function mensajeBienHecho() {
    const textfield = document.getElementById('main-textfield')
    const text = textfield.value

    if (text == undefined || text.length == 0) {
        return false
    }

    //Necesito poner un regex

    return true
}

async function crearMensaje() {
    const response = await fetch('/createmessage',
        {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                message: document.getElementById('main-textfield').value
            })
        }
    ).then(()=>{
        document.getElementById('main-textfield').value = ""
    })
}

window.addEventListener('load', () => {
    const pubButton = document.getElementById('create_pub_button')
    pubButton.onclick = async function () {
        //Checar que el mensaje este bien escrito
        if (!mensajeBienHecho()) {
            return;
        }
        //Hacer un fetch
        crearMensaje().then(
            () => {
                alert("mensaje publicado con exito")
            }
        ).catch((err) => {
            alert("Hubo un error al publicar tu mensaje\nPorfavor intentelo mas tarde")
            console.log(err)
        })
        //Recargar la pagina
    }

})