const Conexion = require("./Conexion");
const DAO = require("./DAO");

class ImagenDAO extends DAO{
    collectionName = "profile_picture";

    constructor(){
        super()
    }
    
    async obtenerImagenDePerfil(uuid) {
        const conexion = await Conexion.obtenerConexion();
        const db = conexion.db(this.dbName);
        const collection = db.collection(this.collectionName)
        const obj = await collection.find({owner: {$eq: uuid}}).next();
        if(obj == null) {
            return null;
        }
        Conexion.cerrarConexion()
        return obj.path;
    }
    /**
     * Guarda una version JSON de un objeto Imagen
     * @param {JSON} image 
     */
    async guardarImagenDePerfil(image) {
        const conexion = await Conexion.obtenerConexion();
        const db = conexion.db(this.dbName)
        const collection = db.collection(this.collectionName)
        await collection.insertOne(image)
        Conexion.cerrarConexion()
    }

    async cambiarImagenDePerfil(filepath, uuid) {
        const conexion = await Conexion.obtenerConexion();
        const db = conexion.db(this.dbName);
        const collection = db.collection(this.collectionName);
        await collection.updateOne({owner: uuid}, {$set: {
            path: filepath
        }})
        Conexion.cerrarConexion()
    }

}

module.exports = ImagenDAO