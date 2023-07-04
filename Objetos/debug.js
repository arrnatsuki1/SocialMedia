const Logica = require('./Logica')
const log = new Logica();
const UsuarioExistenteError = require('./excepciones/UsuarioExistenteError')


log.agregarUsuario({
    body:{
        username: 'Maribela87',
        name: 'Maribela'
    }
}).then(console.log).catch((err) =>{
    console.log(err.name)
})