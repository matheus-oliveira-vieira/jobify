const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const sqlite = require('sqlite')
const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), { Promise })
const port = process.env.PORT || 3000

const categoriaMod = require('./models/categoria')
const vagaMod = require('./models/vaga')

app.use('/admin', (request, response, next) => {
    if(request.hostname === 'localhost'){
        next()
    }else{
        response.send('Not Allowed')
    }
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async(request, response) =>{
    const db = await dbConnection
    const categoriasDb = await categoriaMod.getCategorias(db)()
    const vagas = await vagaMod.getVagas(db)()
    const categorias = categoriasDb.map(cat => {
        return {
            ...cat,
            vagas: vagas.filter( vaga => vaga.categoria === cat.id)
        }
    })
    response.render('home', {
        categorias
    })
})

app.get('/vaga/:id', async(request, response) =>{
    const db = await dbConnection
    const vaga = await vagaMod.getVagasById(db)(request.params.id)
    response.render('vaga', {
        vaga
    })
})

app.get('/admin', async(request, response) =>{
    response.render('admin/home')
})

app.get('/admin/vagas', async(request, response) =>{
    const db = await dbConnection
    const vagas = await vagaMod.getVagas(db)()
    response.render('admin/vagas', {vagas })
})
//ok
app.get('/admin/categorias', async(request, response) =>{
    const db = await dbConnection
    const categorias = await categoriaMod.getCategorias(db)()
    response.render('admin/categorias', {categorias })
})

app.get('/admin/vagas/delete/:id', async(request, response) =>{
    const db = await dbConnection
    const vagas = await vagaMod.deleteVagasById(db)(request.params.id)
    response.redirect('/admin/vagas')
})
//ok
app.get('/admin/categorias/delete/:id', async(request, response) =>{
    const db = await dbConnection
    const vagas = await categoriaMod.deleteCategoriasById(db) (request.params.id)
    response.redirect('/admin/categorias')
})

app.get('/admin/vagas/nova', async(request, response) =>{ 
    const db = await dbConnection
    const categorias = await categoriaMod.getCategorias(db)()
    response.render('admin/nova-vaga', {categorias})

})
//ok
app.get('/admin/categorias/nova', async(request, response) =>{ 
    
    response.render('admin/nova-categoria')

})

app.post('/admin/vagas/nova', async(request, response) =>{ 
    const {titulo, descricao, categoria} = request.body
    const db = await dbConnection
    await vagaMod.InsereVagas(db)(categoria, titulo, descricao)
    response.redirect('/admin/vagas')

})

app.post('/admin/categorias/nova', async(request, response) =>{ 
    const {categoria} = request.body
    const db = await dbConnection
    await categoriaMod.InsereCategorias(db)(categoria)
    response.redirect('/admin/categorias')

})

app.get('/admin/vagas/editar/:id', async(request, response) =>{ 
    const db = await dbConnection
    const categorias = await categoriaMod.getCategorias(db) ()
    const vaga = await vagaMod.getVagasById(db) (request.params.id)
    response.render('admin/editar-vaga', {categorias, vaga})

})

app.get('/admin/categorias/editar/:id', async(request, response) =>{ 
    const db = await dbConnection
    const categorias = await categoriaMod.getCategoriasById(db) (request.params.id)
    response.render('admin/editar-categoria', {categorias})

})

app.post('/admin/vagas/editar/:id', async(request, response) =>{ 
    const {titulo, descricao, categoria} = request.body
    const id = request.params.id
    const db = await dbConnection
    await vagaMod.AtualizaVagas(db)(categoria, titulo, descricao, id)
    response.redirect('/admin/vagas')

})

app.post('/admin/categorias/editar/:id', async(request, response) =>{ 
    const {categoria} = request.body
    const id = request.params.id
    const db = await dbConnection
    await categoriaMod.AtualizaCategoria(db)(categoria, id)
    response.redirect('/admin/categorias')

})


const init = async () =>{
    const db = await dbConnection
    await db.run('create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT);')
    await db.run('create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT);')
    //const categoria = 'Teste de Categoria Team'
    //await db.run(`insert into categorias (categoria) values ('${categoria}')`)
    //const vaga = 'Social Media (San Francisco)'
    //const descricao = 'Vaga para Marketing Digital para o Fullstack'
    //await db.run(`insert into vagas (categoria, titulo, descricao) values (2, '${vaga}', '${descricao}')`)

}

init()
app.listen(port, (err) => {
    if(err){
        console.log('Erro ao iniciar Servidor')
    }else{
        console.log('Servidor Iniciado')
    }
})