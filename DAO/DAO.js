class DAO {
    dbName = process.env.dbName || 'SocialMedia'
    collectionName = null
    constructor(){}
}

module.exports = DAO