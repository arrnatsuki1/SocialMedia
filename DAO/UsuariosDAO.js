const Conexion = require("./Conexion");
const DAO = require("./DAO")

class UsuariosDAO extends DAO {
    
    constructor(){
        super();
        this.collectionName = "Usuarios";
    }

    async obtenerTodos(){
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        let lista = await collection.find({}).toArray()
        return lista
    }

    async insertarUno(user) {
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        await collection.insertOne(user)
        return user.id
    }

    async obtenerPorId(id){
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const user = await collection.find(
            {id: {$eq: id}}
            )
        return user.next()
    }

    async obtenerPorUserName(username){
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const user = await collection.find(
            {username: {$eq: username}}
            )
        return user.next()
    }

    async obtenerPorUserNameYPassword(username, password) {
        const conexion = await Conexion.obtenerConexion()
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)

        const cursor = await collection.find(
            {$and: 
                [
                    {username: {$eq: username}},
                    {password: {$eq: password}}
                ]
            }
        )
        return cursor.next()
    }

    async obtenerSoloAmigos(uuid) {
        let amigos = null;
        const conexion = await Conexion.obtenerConexion()
        const user = await this.obtenerPorId(uuid)
        amigos = user.friendList
        return amigos
    }

    async obtenerListaPorUsuarioSimilar(texto) {
        const conexion = await Conexion.obtenerConexion()
        let encontrados = []
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        var regex = new RegExp(".*"+texto+".*")
        encontrados = await collection.find(
        {username: {$regex: regex, $options: "i"}}
        ).toArray()
        return encontrados
    }

}

module.exports = UsuariosDAO