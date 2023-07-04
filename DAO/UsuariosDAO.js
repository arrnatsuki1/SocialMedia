class UsuariosDAO {
    dbName = "Feisbuk"
    collectionName = "Usuarios"
    constructor(){}

    async obtenerTodos(cliente){
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        let lista = await collection.find({}).toArray()
        return lista
    }

    async insertarUno(cliente, user) {
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        await collection.insertOne(user)
        return user.id
    }

    async obtenerPorId(cliente, id){
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const user = await collection.find(
            {id: {$eq: id}}
            )
        return user.next()
    }

    async obtenerPorUserName(cliente, username){
        console.log(cliente)
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        const user = await collection.find(
            {username: {$eq: username}}
            )
        return user.next()
    }

    async obtenerPorUserNameYPassword(cliente, username, password) {
        const db = cliente.db(this.dbName)
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

    async obtenerSoloAmigos(cliente, uuid) {
        let amigos = null;
        await this.obtenerPorId(cliente, uuid).then(
            (value) => {
                amigos = value.friendList;
            }
        )
        return amigos
    }

    async obtenerListaPorUsuarioSimilar(cliente, texto) {
        let encontrados = []
        const db = cliente.db(this.dbName)
        const collection = db.collection(this.collectionName)
        var regex = new RegExp(".*"+texto+".*")
        encontrados = await collection.find(
        {username: {$regex: regex, $options: "i"}}
        ).toArray()
        return encontrados
    }

}

module.exports = UsuariosDAO