class UsuarioExistenteError extends Error {
    constructor(msg){
        super(msg)
        this.name = "UsuarioExistenteError"
    }
}

module.exports = UsuarioExistenteError