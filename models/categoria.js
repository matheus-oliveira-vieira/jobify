//modified create getCategorias
const getCategorias = db => async() => {
    
    const categorias = await db.all('select * from categorias;')
    return categorias
}
//modified create getCategoriasById
const getCategoriasById = db => async(id) =>{
    const categoria = await db.get('select * from categorias where id = '+id)
    return categoria
}



//modified create deleteCategoriasById
const deleteCategoriasById = db => async(id) => {
    
    const categoria = await db.all('delete from categorias where id = ' + id)
    return categoria
}



//modified create InsereCategorias
const InsereCategorias = db => async(categoria) => {
    
    await db.run(`insert into categorias (categoria) values ('${categoria}')`)
}



//modified create AtualizaCategoria
const AtualizaCategoria = db => async(categoria, id) => {
    await db.run(`update categorias set categoria = '${categoria}' where id = ${id} `)
}

module.exports = {
    getCategorias,
    getCategoriasById,
    deleteCategoriasById,
    InsereCategorias,
    AtualizaCategoria
}