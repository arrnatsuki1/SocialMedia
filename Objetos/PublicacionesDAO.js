const DAO = require('./DAO')

class PublicacionesDAO extends DAO {
    constructor(){
        super();
        this.collectionName = "publicaciones"
    }
    /**
     * Obtiene todas las publicaciones de un usuario por su nombre
     * COF COF los nombres no pueden repetirse
     */
    async obtenerTodasPorUsuario(cliente, usuario){
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)

        const cursor = await collection.find(
            {"creator.name": {$eq: usuario.name}}
        ).sort({date: -1}).toArray()
        return cursor
    }

    async obtenerTodasPorUuid(cliente, uuid){
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const cursor = await collection.find(
            {"creator.id": {$eq: uuid}}
        ).sort({date: -1}).toArray()
        return cursor
    }

    async crearNuevaPublicacion(cliente, publicacion) {
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        await collection.insertOne(publicacion)
        return true
    }

    async obtenerPublicacion(cliente, objID) {
        throw new Error("Not implemented yet")
    }
    
    /**
     * Metodo para obtener las diez publicaciones mas recientes de un usuario
     * @param {Connection} cliente 
     * @param {String} uuid 
     * @returns {Array}
     */
    async obtenerDiezResientes(cliente, uuid) {
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)

        const publicationes = await collection.find({
            "creator.id": {$eq: uuid}
        }).limit(10).sort({date: -1})
        return publicationes.toArray()
    }

}

module.exports = PublicacionesDAO