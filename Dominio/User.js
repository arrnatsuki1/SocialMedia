const { v4 } = require('uuid') //Identificador unico

/* POJO Class Plain Object */
class User {
    constructor(name, username, password, uuid, friendList) {
        this.name = name
        this.username = username
        this.id = uuid || v4() //Unique ID
        this.password = password
        this.friendList = friendList || []
    }
    toJSON(){
        return {
            name: this.name,
            username: this.username,
            password: this.password,
            id: this.id,
            friendList: this.friendList
        }
    }
}

module.exports = User
