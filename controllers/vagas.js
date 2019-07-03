
const vagaMod = require('../models/vaga')

const getVagas = (db, dbConnection) => async(request, response) =>{
    db = await dbConnection
    const vaga = await vagaMod.getVagasById(db)(request.params.id)
    response.render('vaga', {vaga})
}

const deleteVagas = (db, dbConnection) => async(request, response) =>{
    db = await dbConnection
    const vagas = await vagaMod.deleteVagasById(db)(request.params.id)
    response.redirect('/admin/vagas')
}

const inserirVagas = (db, dbConnection) => async(request, response) =>{ 
    const {titulo, descricao, categoria} = request.body
    db = await dbConnection
    await vagaMod.InsereVagas(db)(categoria, titulo, descricao)
    response.redirect('/admin/vagas')
}

const getVagasId = (db, dbConnection) => async(request, response) =>{ 
    db = await dbConnection
    const vaga = await vagaMod.getVagasById(db) (request.params.id)
    response.render('admin/editar-vaga', {vaga})
}

const editaVagas = (db, dbConnection) => async(request, response) =>{ 
    const {titulo, descricao, categoria} = request.body
    const id = request.params.id
    db = await dbConnection
    await vagaMod.AtualizaVagas(db)(categoria, titulo, descricao, id)
    response.redirect('/admin/vagas')
}

module.exports = {
    getVagas,
    deleteVagas,
    inserirVagas,
    getVagasId,
    editaVagas
}