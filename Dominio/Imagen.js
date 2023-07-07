class Imagen {
    constructor(owner, path){
        this.owner = owner;
        this.path = path;
    }
    toJSON() {
        return {
            owner: this.owner,
            path: this.path
        }
    }
}

module.exports = Imagen