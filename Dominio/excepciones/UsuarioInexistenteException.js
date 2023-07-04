class UsuarioInexistenteException extends Error {
    constructor(msg) {
        super(msg)
        this.name = "UsuarioInexistenteException"
    }
}

module.exports = UsuarioInexistenteException;