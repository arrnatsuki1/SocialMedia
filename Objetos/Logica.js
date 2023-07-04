const Connection = require('./Connection')
const PublicacionesDAO = require('./PublicacionesDAO')
const UsuariosDAO = require('./UsuariosDAO')
const Usuario = require('./User')
const UsuarioExistenteError = require('./excepciones/UsuarioExistenteError')
const UsuarioInexistenteException = require('./excepciones/UsuarioInexistenteException')
const Publicacion = require('./Publicacion')

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
        async function buscarMiddleware() {
            const dao = new UsuariosDAO()
            await dao.obtenerPorId(
                conexion.client, uuid
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

}

module.exports = Logica