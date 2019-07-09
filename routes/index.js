const init = (db, dbConnection) => {
    const vagaRouter = require('./vagas')
    const categoriaRouter = require('./categorias')
    const router = require('express').Router()
    router.use(vagaRouter(db, dbConnection))
    router.use(categoriaRouter(db, dbConnection))
    return router
}

module.exports = init