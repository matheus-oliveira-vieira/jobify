const init = (db, dbConnection) => {
    const router = require('express').Router()
    const vagaCont = require('../controllers/vagas')
    
    router.get('/vaga/:id', vagaCont.getVagas(db, dbConnection))

    router.get('/admin/vagas', async(request, response) =>{
        response.render('admin/vagas')
    })

    router.get('/admin/vagas/delete/:id', vagaCont.deleteVagas(db, dbConnection))

    router.get('/admin/vagas/nova', async(request, response) =>{ 
        response.render('admin/nova-vaga')
    })

    router.post('/admin/vagas/nova', vagaCont.inserirVagas(db, dbConnection))

    router.get('/admin/vagas/editar/:id', vagaCont.getVagasId(db, dbConnection))
    
    router.post('/admin/vagas/editar/:id', vagaCont.editaVagas(db, dbConnection))

    return router
}

module.exports = init