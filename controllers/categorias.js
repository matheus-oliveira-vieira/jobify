const categoriaMod = require('../models/categoria')
const deleteCategorias = (db, dbConnection) => async(request, response) =>{
    db = await dbConnection
    const vagas = await categoriaMod.deleteCategoriasById(db) (request.params.id)
    response.redirect('/admin/categorias')
}

const inserirCategorias = (db, dbConnection) => async(request, response) =>{ 
    const {categoria} = request.body
    db = await dbConnection
    await categoriaMod.InsereCategorias(db)(categoria)
    response.redirect('/admin/categorias')
}

const getCategoriasId = (db, dbConnection) => async(request, response) =>{ 
    db = await dbConnection
    const categorias = await categoriaMod.getCategoriasById(db) (request.params.id)
    response.render('admin/editar-categoria', {categorias})
}

const editaCategorias = (db, dbConnection) => async(request, response) =>{ 
    const {categoria} = request.body
    const id = request.params.id
    db = await dbConnection
    await categoriaMod.AtualizaCategoria(db)(categoria, id)
    response.redirect('/admin/categorias')
}

module.exports = {
    deleteCategorias,
    inserirCategorias,
    getCategoriasId,
    editaCategorias
}