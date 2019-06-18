//modified create getVagas
const getVagas = db => async() => {
    
    const vagas = await db.all('select * from vagas;')
    return vagas
}

//modified create getVagasById
const getVagasById = db => async(id) => {
    
    const vaga = await db.get('select * from vagas where id = '+ id)
    return vaga
}

//modified create deleteVagasById
const deleteVagasById = db => async(id) => {
    
    const vagas = await db.all('delete from vagas where id = ' + id)
    return vagas
}

//modified create InsereVagas
const InsereVagas = db => async(categoria, titulo, descricao) => {
    
    await db.run(`insert into vagas (categoria, titulo, descricao) values ('${categoria}', '${titulo}', '${descricao}')`)
}

//modified create AtualizaVagas
const AtualizaVagas = db => async(categoria, titulo, descricao, id) => {
    
    await db.run(`update vagas set categoria = ${categoria}, titulo = '${titulo}', descricao = '${descricao}' where id = ${id} `)
}

module.exports = {
    getVagas,
    getVagasById,
    deleteVagasById,
    InsereVagas,
    AtualizaVagas
}