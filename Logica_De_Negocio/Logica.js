const PublicacionesDAO = require('../DAO/PublicacionesDAO')
const UsuariosDAO = require('../DAO/UsuariosDAO')
const Usuario = require('../Dominio/User')
const UsuarioExistenteError = require('../Dominio/excepciones/UsuarioExistenteError')
const UsuarioInexistenteException = require('../Dominio/excepciones/UsuarioInexistenteException')
const Publicacion = require('../Dominio/Publicacion')
const ImagenDAO = require('../DAO/ImagenDAO')
const Imagen = require('../Dominio/Imagen')
const fs = require('fs')
const path = require('path')

class Logica {

    constructor() {

    }

    /**
     * String con el formato uuid de la libreria uuis
     * @param {String} uuid 
     */
    async traerPublicacionesDeAmigos(uuid) {
        //Traemos a los amigos de esta persona
        const daousuarios = new UsuariosDAO()
        let friendList = await daousuarios.obtenerSoloAmigos(uuid)
        //Por cada amigo traemos 10 publicaciones resientes
        const publicacionesdao = new PublicacionesDAO()
        const pubs = [];
        for (let i = 0; i < friendList.length; i++) {
            pubs[i] = await publicacionesdao.obtenerDiezResientes(friendList[i])
        }
        return pubs
    }

    async obtenerTodasLasPublicaciones(usuario) {
        const dao = new PublicacionesDAO()
        const pubs = await dao.obtenerTodasPorUsuario(usuario)
        return pubs;
    }

    async obtenerTodasLasPublicacionesPorUuid(uuid) {
        const dao = new PublicacionesDAO()
        let pubs = await dao.obtenerTodasPorUuid(uuid);
        return pubs;
    }

    async obtenerPerfilCompleto(username) {
        const user = await this.buscarPorUserName(username)
        if (user == null || user == undefined) {
            throw new UsuarioInexistenteException("El usuario no existe")
        }

        const imagendao = new ImagenDAO()
        user.picture = await imagendao.obtenerImagenDePerfil(user.id)
        const pubs = await this.obtenerTodasLasPublicacionesPorUuid(user.id)
        return {
            pubs: pubs,
            user: user
        }
    }

    async buscarPorUserName(user) {
        const dao = new UsuariosDAO()
        const encontrado = await dao.obtenerPorUserName(user)
        return encontrado
    }

    async obtenerPorUuid(uuid) {
        const dao = new UsuariosDAO()
        const encontrado = await dao.obtenerPorId(uuid)
        if (encontrado != null) {
            const imagendao = new ImagenDAO()
            encontrado.picture = await imagendao.obtenerImagenDePerfil(encontrado.id)
        }
        return encontrado
    }

    async agregarUsuario(bodyReq) {

        //Verificar que no haya uno con el mismo username
        let encontrado = await this.buscarPorUserName(bodyReq.body.username)

        if (encontrado != null) {
            throw new UsuarioExistenteError("El usuario ya existe en la base de datos")
        }

        const userInfo = bodyReq.body
        const user = new Usuario(
            userInfo.name,
            userInfo.username,
            userInfo.password
        )
        const dao = new UsuariosDAO()
        const uuid = await dao.insertarUno(user.toJSON())
        await agregarUsuario()
        return uuid
    }

    async inicioDeSesion(req) {
        const body = req.body
        const daousuarios = new UsuariosDAO()
        const usuario = await daousuarios
            .obtenerPorUserNameYPassword(body.username, body.password)
        return usuario
    }

    async crearPublicacion(uuid, message) {
        //Obtener toda la informacion del usuario
        let user = await this.obtenerPorUuid(uuid)
        const daopublicaciones = new PublicacionesDAO()
        const publicacion = new Publicacion(user, message, new Date())

        const makeit = await daopublicaciones
            .crearNuevaPublicacion(publicacion.toJSON())

        return makeit
    }

    async buscarUsuariosConUsuarioSimilar(username) {
        const usuariosdao = new UsuariosDAO()
        let usuarios = []
        usuarios = await usuariosdao.obtenerListaPorUsuarioSimilar(username)
        return usuarios
    }

    async guardarImagenDePerfil(filename, uuid) {
        filename = '/public/upload/userpicture/' + filename;
        const imagendao = new ImagenDAO()
        //Buscar si tiene una imagen de perfil existente
        const tiene = await imagendao.obtenerImagenDePerfil(uuid)
        if (tiene == null) {
            //Sino crear un nuevo campo
            const imagen = new Imagen(uuid, filename)
            await imagendao.guardarImagenDePerfil(imagen.toJSON())
        } else {
            const ruta = tiene
            fs.unlinkSync(path.join(__dirname, "..", ruta))
            //Si la tiene, actualizarla
            await imagendao.cambiarImagenDePerfil(filename, uuid)
        }
    }

    async esMiAmigo(username, uuid) {
        const daousuarios = new UsuariosDAO()
        const usuario = await daousuarios.obtenerPorUserName(username)
        const esMiAmigo = usuario.friendList.indexOf(uuid) >= 0 ? true : false;
        return esMiAmigo
    }

    async loSigo(myuuid, theiruuid) {
        const daousuarios = new UsuariosDAO()
        const usuario = await daousuarios.obtenerPorUserName(myuuid)
        const loSigo = usuario.friendList.indexOf(theiruuid) >= 0 ? true : false;
        return loSigo
    }

}

module.exports = Logica