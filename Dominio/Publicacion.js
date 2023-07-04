/* Another PoJSON */
/**
 * Is there a way to create records in JavaScript?
 */
class Publicacion {
    /**
     * Attributes
     * creator is the full object of the user
     */
    creator = null;
    date = null;
    message = null;
    constructor(creator, message, date){
        this.creator = creator;
        this.date = date || new Date();
        this.message = message;
    }
    toJSON() {
        return {
            creator: this.creator,
            date: this.date,
            message: this.message
        }
    }
}

module.exports = Publicacion