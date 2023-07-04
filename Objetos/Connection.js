const { MongoClient } = require('mongodb')

class Connection {
    host = 'localhost'
    port = null
    driver = null
    client = null
    url = null
    constructor(driver, port, host){
        if (host != null) {
            this.host = host
        }
        if(driver != null) {
            this.driver = driver
        }
        if(port != null) {
            this.port = port
        }/*
        this.tryConnect()
        .then(console.log("Conexion abierta"))*/
    }

    async tryConnect(){
        this.url = this.driver + '://' + this.host + ":" + this.port
        this.client = new MongoClient(this.url)
        await this.client.connect()
    }

    logout() {
        if(this.client == null) {
            throw Error("El cliente es nulo")
        }
        this.client.close()
    }

}

module.exports = Connection