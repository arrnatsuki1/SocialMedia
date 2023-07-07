const { MongoClient } = require("mongodb");

class Conexion {
    static cliente = null;

    static async obtenerConexion() {
        if(this.cliente != null ) {
            return this.cliente
        }
        const url = "mongodb://localhost:27017"
        this.cliente = new MongoClient(url)
        await this.cliente.connect()
        return this.cliente
    }
    /**
     * Is this necesary?
     */
    static cerrarConexion() {
        if(this.cliente == null) {
            throw new Error("El cliente ya esta cerrado")
        }
        this.cliente.close()
        this.cliente = null
    }

}

module.exports = Conexion