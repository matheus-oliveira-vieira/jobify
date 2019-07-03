const init = (db, dbConnection) => {
    const router = require('express').Router()
    const categoriaCont = require('../controllers/categorias')

router.get('/admin/categorias', async(request, response) =>{
    response.render('admin/categorias')
})

router.get('/admin/categorias/delete/:id', categoriaCont.deleteCategorias(db, dbConnection))

router.get('/admin/categorias/nova', async(request, response) =>{ 
    response.render('admin/nova-categoria')
})

router.post('/admin/categorias/nova', categoriaCont.inserirCategorias(db, dbConnection))

router.get('/admin/categorias/editar/:id', categoriaCont.getCategoriasId(db, dbConnection))

router.post('/admin/categorias/editar/:id', categoriaCont.editaCategorias(db, dbConnection))

return router
}

module.exports = init