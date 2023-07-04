window.addEventListener('load', ()=>{
    const logoutButton = document.getElementById('logout_button')
    logoutButton.onclick = function(){
        window.location = '/logout'
    }
    const profileButton = document.getElementById('Perfil')
    profileButton.onclick = function() {
        window.location = '/profile'
    }
    const mainpage = document.getElementById('mainpage_button')
    mainpage.onclick = function() {
        window.location = '/'
    }
})

