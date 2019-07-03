const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const sqlite = require('sqlite')
const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), { Promise })
const port = process.env.PORT || 3000

const categoriaMod = require('./models/categoria')
const vagaMod = require('./models/vaga')
const vagaCont = require('./controllers/vagas')
const categoriaCont = require('./controllers/categorias')
const homeCont = require('./controllers/home')

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

let locals = null
app.use(async(req, res, next) => {
    const db = await dbConnection
    const categorias = await categoriaMod.getCategorias(db)()
    const vagas = await vagaMod.getVagas(db)()
    locals = res.locals = {
        categorias, vagas
    }
    next()
    return locals
})

app.get('/', async(request, response) =>{
    const categoriasDb = locals.categorias.map(cat => {
        return {
            ...cat,
            vagas: locals.vagas.filter( vaga => vaga.categoria === cat.id)
        }
    })
    response.render('home', {
        categorias: categoriasDb
    })
})

let db = null;


app.get('/vaga/:id', vagaCont.getVagas(db, dbConnection))

app.get('/admin', async(request, response) =>{
    response.render('admin/home')
})

app.get('/admin/vagas', async(request, response) =>{
    response.render('admin/vagas')
})

app.get('/admin/categorias', async(request, response) =>{
    response.render('admin/categorias')
})

app.get('/admin/vagas/delete/:id', vagaCont.deleteVagas(db, dbConnection))

app.get('/admin/categorias/delete/:id', categoriaCont.deleteCategorias(db, dbConnection))

app.get('/admin/vagas/nova', async(request, response) =>{ 
    response.render('admin/nova-vaga')
})

app.get('/admin/categorias/nova', async(request, response) =>{ 
    response.render('admin/nova-categoria')
})

app.post('/admin/vagas/nova', vagaCont.inserirVagas(db, dbConnection))

app.post('/admin/categorias/nova', categoriaCont.inserirCategorias(db, dbConnection))

app.get('/admin/vagas/editar/:id', vagaCont.getVagasId(db, dbConnection))

app.get('/admin/categorias/editar/:id', categoriaCont.getCategoriasId(db, dbConnection))

app.post('/admin/vagas/editar/:id', vagaCont.editaVagas(db, dbConnection))

app.post('/admin/categorias/editar/:id', categoriaCont.editaCategorias(db, dbConnection))


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