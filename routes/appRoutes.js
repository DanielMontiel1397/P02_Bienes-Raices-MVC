import express from 'express'
import {paginaInicio, paginaCategoria, paginaNoEncontrado, buscador} from '../controllers/appController.js'

const router = express.Router();

//Pagina de Inicio 
router.get('/',paginaInicio);

//Categorias
router.get('/categorias/:id',paginaCategoria);

//Pagina 404
router.get('/404',paginaNoEncontrado)

//Buscador
router.post('/buscador',buscador)

export default router;