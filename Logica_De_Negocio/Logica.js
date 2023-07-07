const Connection = require('../DAO/Connection')
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
        const conexion = new Connection('mongodb', 27017)
        let friendList;
        const pubs = [];
        async function traerASusAmigos() {
            const daousuarios = new UsuariosDAO()
            friendList = await daousuarios.obtenerSoloAmigos(conexion.client, uuid)
            await traerDiezPublicaciones()
        }

        async function traerDiezPublicaciones() {
            const publicacionesdao = new PublicacionesDAO()
            //Obtener 10 publicaciones de cada amigo/seguidor
            for (let i = 0; i < friendList.length; i++) {
                await publicacionesdao.obtenerDiezResientes(
                    conexion.client,
                    friendList[i]
                )
                    .then((values) => {
                        pubs[i] = values
                    })
            }

            conexion.logout()
        }

        await conexion.tryConnect().then(
            traerASusAmigos
        )
        return pubs
    }

    async obtenerTodasLasPublicaciones(usuario) {
        const conexion = new Connection("mongodb", 27017)
        const dao = new PublicacionesDAO()
        let pubs;

        //Despues de comprobar que la conexion funciona
        const placeholder1 = async function () {
            await dao.obtenerTodasPorUsuario(conexion.client, usuario)
                .then((cursor) => {
                    placeholder2(cursor)
                })
        }
        //Despues de obtener todas las publicaciones de
        //Un usuario
        const placeholder2 = function (value) {
            pubs = value;
            //Cerrar la sesion de las conexiones
            conexion.logout()
        }

        await conexion.tryConnect()
            .then(placeholder1)
        return pubs;
    }

    async obtenerTodasLasPublicacionesPorUuid(uuid) {
        const conexion = new Connection("mongodb", 27017)
        const dao = new PublicacionesDAO()
        let pubs;

        //Despues de comprobar que la conexion funciona
        const placeholder1 = async function () {
            await dao.obtenerTodasPorUuid(conexion.client, uuid)
                .then((cursor) => {
                    placeholder2(cursor)
                })
        }
        //Despues de obtener todas las publicaciones de
        //Un usuario
        const placeholder2 = function (value) {
            pubs = value;
            //Cerrar la sesion de las conexiones
            conexion.logout()
        }

        await conexion.tryConnect()
            .then(placeholder1)
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
        const conexion = new Connection("mongodb", 27017)
        let encontrado = null;
        async function buscarMiddleware() {
            const dao = new UsuariosDAO()
            await dao.obtenerPorUserName(
                conexion.client, user
            ).then((usuario) => {
                encontrado = usuario
            })
            conexion.logout()
        }
        await conexion.tryConnect()
            .then(
                buscarMiddleware
            ).catch((err) => {
                throw new Error("AY UN ERROR")
            })
        return encontrado
    }

    async obtenerPorUuid(uuid) {
        const conexion = new Connection("mongodb", 27017)
        let encontrado = null;

        await conexion.tryConnect()

        async function buscarFotoDePerfil(usuario) {
            const imagendao = new ImagenDAO()
            return await imagendao.obtenerImagenDePerfil(usuario.id)
        }

        async function buscarMiddleware() {
            const dao = new UsuariosDAO()
            return await dao.obtenerPorId(conexion.client, uuid)
        }

        encontrado = await buscarMiddleware()

        if(encontrado != null) {
            encontrado.picture = await buscarFotoDePerfil(encontrado)
        }

        conexion.logout()
        return encontrado
    }

    async agregarUsuario(bodyReq) {

        let encontrado = await this.buscarPorUserName(bodyReq.body.username)

        if (encontrado != null) {
            throw new UsuarioExistenteError("El usuario ya existe en la base de datos")
        }

        //Verificar que no haya uno con el mismo username
        const conexion = new Connection("mongodb", 27017)
        let uuid = null;

        async function agregarUsuarioMiddleWare() {
            const userInfo = bodyReq.body

            const user = new Usuario(
                userInfo.name,
                userInfo.username,
                userInfo.password
            )
            const dao = new UsuariosDAO()
            uuid = await dao.insertarUno(conexion.client, user.toJSON())
            conexion.logout()
        }

        await conexion.tryConnect()
            .then(agregarUsuarioMiddleWare)

        return uuid
    }

    async inicioDeSesion(req) {
        const body = req.body
        const conexion = new Connection("mongodb", 27017)
        const daousuarios = new UsuariosDAO()
        let usuario = null;

        async function buscarUsuario() {
            await daousuarios.obtenerPorUserNameYPassword(
                conexion.client, body.username, body.password
            ).then(
                (value) => {
                    usuario = value;
                    conexion.logout()
                }
            ).catch((err) => {
                throw new Error("Ocurrio un error buscando al usuario en la base de datos")
            })
        }

        await conexion.tryConnect()
            .then(buscarUsuario)
        return usuario
    }

    async crearPublicacion(uuid, message) {
        const conexion = new Connection('mongodb', 27017)

        //Obtener toda la informacion del usuario
        let user = await this.obtenerPorUuid(uuid)
        let makeit = false
        async function insertarPublicacion() {
            const daopublicaciones = new PublicacionesDAO()
            const publicacion = new Publicacion(user, message, new Date())

            makeit = daopublicaciones.crearNuevaPublicacion(
                conexion.client,
                publicacion.toJSON())

        }

        await conexion.tryConnect().then(insertarPublicacion)
        return makeit
    }

    async buscarUsuariosConUsuarioSimilar(username) {
        const conexion = new Connection('mongodb', 27017)

        const usuariosdao = new UsuariosDAO()
        let usuarios = []
        await conexion.tryConnect().then(
            () => {
                usuarios = usuariosdao.obtenerListaPorUsuarioSimilar(
                    conexion.client,
                    username
                )
            }
        )
        return usuarios
    }

    async guardarImagenDePerfil(filename, uuid) {
        filename = '/public/upload/userpicture/'+filename;
        const imagendao = new ImagenDAO()
        //Buscar si tiene una imagen de perfil existente
        const tiene = await imagendao.obtenerImagenDePerfil(uuid)
        if(tiene == null) {
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

}

module.exports = Logica