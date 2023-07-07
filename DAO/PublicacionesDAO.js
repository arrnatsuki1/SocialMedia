const DAO = require('./DAO')
const Conexion = require('./Conexion')

class PublicacionesDAO extends DAO {
    constructor(){
        super();
        this.collectionName = "publicaciones"
    }
    /**
     * Obtiene todas las publicaciones de un usuario por su nombre
     * COF COF los nombres no pueden repetirse
     */
    async obtenerTodasPorUsuario(usuario){
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)

        const cursor = await collection.find(
            {"creator.name": {$eq: usuario.name}}
        ).sort({date: -1}).toArray()
        return cursor
    }

    async obtenerTodasPorUuid(uuid){
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const cursor = await collection.find(
            {"creator.id": {$eq: uuid}}
        ).sort({date: -1}).toArray()
        return cursor
    }

    async crearNuevaPublicacion(publicacion) {
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        await collection.insertOne(publicacion)
        return true
    }

    async obtenerPublicacion(objID) {
        throw new Error("Not implemented yet")
    }
    
    async obtenerDiezResientes(uuid) {
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const publicationes = await collection.find({
            "creator.id": {$eq: uuid}
        }).limit(10).sort({date: -1})
        return publicationes.toArray()
    }

}

module.exports = PublicacionesDAO