window.addEventListener('load', () => {
    const logoutButton = document.getElementById('logout_button')
    logoutButton.onclick = function () {
        window.location = '/logout'
    }
    const profileButton = document.getElementById('Perfil')
    profileButton.onclick = function () {
        window.location = '/profile'
    }
    const mainpage = document.getElementById('mainpage_button')
    mainpage.onclick = function () {
        window.location = '/'
    }/*
    const textfield = document.getElementById('main-textfield')
    textfield.onkeydown = function (evt) {
        console.log(evt.key)
        if (evt.key.match(/[<>/]/) != null) {
            evt.preventDefault()
            return;
        }
        //Esto esta mal
        const p = document.getElementById('counter')
        const totalChars = 155
        p.innerText = totalChars - textfield.value.length 
        if (parseInt(p.textContent) <= 0) {
            p.innerText = 0
            return;
        }
    }*/
})

