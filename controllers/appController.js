import { Sequelize} from "sequelize"
import {Precio, Categoria, Propiedad} from "../models/index.js"
import { esVendedor } from "../helpers/index.js"

const paginaInicio = async (req,res) => {

    const categorias = await Categoria.findAll({raw:true})
    const precios = await Precio.findAll({raw:true})

    const [casas,departamentos] = await Promise.all([
        Propiedad.findAll({
            limit: 3,
            where: {
                llaveForaneaCategoria: 1,
                publicado: 1
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [
                ['createdAt','DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                llaveForaneaCategoria: 2,
                publicado: 1
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [
                ['createdAt','DESC']
            ]
        })
    ])


    res.render('inicio',{
        pagina: "Inicio",
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    })
}

const mostrarPropiedad = async (req,res) => {

    //Validar
    const {id} = req.params;
    
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    });

    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404')
    }

    res.render('mostrarApp',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.llaveForaneaUsuario)
    })
}

const paginaCategoria = async (req,res) => {

    const {id} = req.params;

    //Comprobar que la categoria existe
    const categoria = await Categoria.findByPk(id)

    if(!categoria){
        return res.render('404',{
            pagina: 'No Encontrada'
        });
    }

    //Obtener las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            llaveForaneaCategoria: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
        
    })

    res.render('categoria',{
        pagina: `${categoria.categoriaPropiedad}s en venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })

}

const paginaNoEncontrado = (req,res) => {
    res.render('404',{
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req,res) => {

    const {termino} = req.body

    //Validar que termino no este vacio
    if(!termino.trim()){
        return res.redirect('back');
    }

    //Consultar propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            tituloPropiedad: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda',{
        pagina: 'Resultados de la Búsqueda',
        propiedades,
        csrfToken: req.csrfToken()
    })

}

export {
    paginaInicio,
    mostrarPropiedad,
    paginaCategoria,
    paginaNoEncontrado,
    buscador
}