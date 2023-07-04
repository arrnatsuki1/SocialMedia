async function buscar() {
    const textobuscador = document.getElementById("buscador").value
    window.location = `/buscador/${textobuscador}`
}

window.addEventListener('load', () => {
    const textfield = document.getElementById('buscador')
    textfield.onkeydown = event => {
        if(event.key != "Enter" || textfield.value.length == 0) {
            return
        }
        window.location = "/buscador/"+textfield.value
    }
})