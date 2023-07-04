window.addEventListener('load', ()=>{
    buttonToGetBack()
})

//Regresar a la pagina de login
function buttonToGetBack() {
    const button = document.getElementById("Regresar")
    button.onclick = function () {
        window.location =
            "/login"
    }
}
