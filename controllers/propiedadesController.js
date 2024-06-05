import {unlink} from "node:fs/promises"
import { validationResult } from "express-validator";
import { Usuario,Precio, Categoria, Propiedad, Mensaje} from '../models/index.js'
import { esVendedor, formatearFecha } from "../helpers/index.js";

const admin = async (req,res) => {

    //Leer Query String
    const {pagina: paginaActual} = req.query;

    //Validar que siempre este presente

    //Para esto usamos una expresión regular
    const expresionRegular = /^[1-9]$/; //Dice que siempre tiene que iniciar con digitos y finalizar con dígitos

    if(!expresionRegular.test(paginaActual)){ //Retorna true o false, si una variable cumple con la expresión regular
        return res.redirect('/propiedades/mis-propiedades?pagina=1')
    }
    
    try{
        const {id} = req.usuario;
        
        //Paginando Registros, Mostrando Resultados de 10 en 10
        const limit = 4; //El limete de registros que leerá por página
        const offset = ((paginaActual * limit) - limit); //Será el primer registro que se empezará a mostrar

        const [propiedades,total] = await Promise.all([
        
            Propiedad.findAll({
                limit: limit,
                offset: offset,
                where: {
                llaveForaneaUsuario: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio'},
                    { model: Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({ //Nos ayudará a contar el número total de registros
                where: {
                    llaveForaneaUsuario : id
                }
            })
        ]);

        const numeroPaginas = Math.ceil(total/limit)
        

        res.render('propiedades/admin',{
            pagina: "Mis propiedades",
            csrfToken: req.csrfToken(),
            propiedades,
            paginas: numeroPaginas,
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    }catch(error){

    }

    
}

//formulario para crear una nueva Propiedad
const crear =  async (req,res) => {

    //Consultar modelo de precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear',{
        pagina: "Crear Propiedad",
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        propiedad: {}
    })
}

//Al enviar el formulario mandamos a llamar la función
const guardarPropiedad = async(req,res) => {

    //Validamos si los campos estan llenos
    let resultado = validationResult(req);

    //Consultar modelo de precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    //Vereficar que el resultado esta vacio
    if(!resultado.isEmpty()){

        return res.render('propiedades/crear',{
            pagina: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            propiedad: req.body
        })

    }
    
    //Crear Registro
    const {tituloPropiedad,descripcionPropiedad,categoriaPropiedad,precioPropiedad,habitacionesPropiedad,estacionamientoPropiedad,wcPropiedad,lat,lng,calle} = req.body

    const {id: llaveForaneaUsuario} = req.usuario

    try{
         const propiedadGuardada = await Propiedad.create({
            tituloPropiedad,
            descripcionPropiedad,
            llaveForaneaCategoria: categoriaPropiedad,
            llaveForaneaPrecio: precioPropiedad,
            habitacionesPropiedad,
            estacionamientoPropiedad,
            wcPropiedad,
            calle,
            lat,
            lng,
            llaveForaneaUsuario,
            imagen: ''
         })

         const {id} =propiedadGuardada;
         res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch(error){
        console.log(error);
    }

}

const agregarImagen = async (req,res) => {

    const {id} = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        console.log("No existe propiedad")
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Validar que la propiedad no este publicada
    if(propiedad.publicado){
        console.log('Ya esta publicada')
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visita esta pagina
    if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
        console.log(propiedad.llaveForaneaUsuario)
        console.log(req.usuario.id)
        return res.redirect('/propiedades/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen',{
        pagina: `Agregar Imagen: ${propiedad.tituloPropiedad}`,
        csrfToken: req.csrfToken(),
        propiedad
    });
}

const almacenarImagen = async (req,res,next) => {
    const {id} = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        console.log("No existe propiedad")
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Validar que la propiedad no este publicada
    if(propiedad.publicado){
        console.log('Ya esta publicada')
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visita esta pagina
    if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/propiedades/mis-propiedades')
    }

    try{

        //Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename

        propiedad.publicado = 1;
        
        await propiedad.save();
        next()

    } catch(error){
        console.log(error)
    }
}

const editarPropiedad = async (req,res) => {

    const {id} = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Consultar modelo de precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar-propiedad',{
        pagina: `Editar Propiedad: ${propiedad.tituloPropiedad}`,
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        propiedad: propiedad
    })
}

const guardarCambios = async (req,res) => {
    //Verificar la validacion
    let resultado = validationResult(req);

    //Consultar modelo de precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    //Vereficar que el resultado esta vacio
    if(!resultado.isEmpty()){

        return res.render('propiedades/editar-propiedad',{
            pagina: "Editar Propiedad",
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            propiedad: req.body
        })

    }

    const {id} = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Reescribir el objeto y actualizarlo
    try{
        const {tituloPropiedad,descripcionPropiedad,categoriaPropiedad,precioPropiedad,habitacionesPropiedad,estacionamientoPropiedad,wcPropiedad,lat,lng,calle} = req.body

        propiedad.set({
            tituloPropiedad,
            descripcionPropiedad,
            llaveForaneaCategoria: categoriaPropiedad,
            llaveForaneaPrecio: precioPropiedad,
            habitacionesPropiedad,
            estacionamientoPropiedad,
            wcPropiedad,
            lat,
            lng,
            calle
        })

        await propiedad.save();

        res.redirect('/propiedades/mis-propiedades')
    }catch(error){
        console.log(error)
    }
}

const eliminarPropiedad = async (req,res) => {

    //Validación
    const {id} = req.params;

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect('/propiedades/mis-propiedades')
    }

    //Revisar que quien visita la url es quien creo la propiedad
    if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/propiedades/mis-propiedades')
    }
    
    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)

    //Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/propiedades/mis-propiedades');


}

//Modifica el estado de la propiedad
const cambiarEstado = async(req,res) => {
    
        //Validación
        const {id} = req.params;

        //Validar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id);
    
        if(!propiedad){
            return res.redirect('/propiedades/mis-propiedades')
        }
    
        //Revisar que quien visita la url es quien creo la propiedad
        if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
            return res.redirect('/propiedades/mis-propiedades')
        }

        //Actualizar
        propiedad.publicado = !propiedad.publicado

        await propiedad.save();

        res.json({
            resultado: 'ok'
        })

}

//Muestra una propiedad
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

    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.llaveForaneaUsuario)
    })
}

//Enviar Mensaje a vendedor
const enviarMensaje = async(req,res) =>{

    //Validar
    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    });

    if(!propiedad){
        return res.redirect('/propiedad/404')
    }

    //Renderizar los errores

    //Validamos si los campos estan llenos
    let resultado = validationResult(req);

    //Vereficar que el resultado esta vacio
    if(!resultado.isEmpty()){

        res.render('propiedades/mostrar',{
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id,propiedad.llaveForaneaUsuario),
            errores: resultado.array()
        })

    }

    //Enviar Mensaje
    const {mensaje} = req.body;
    const {id: propiedadId} = req.params
    const { id: usuarioId} = req.usuario

    await Mensaje.create({
        mensaje: mensaje,
        llaveForaneaPropiedad: propiedadId,
        llaveForaneaUsuario: usuarioId
    })

    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.llaveForaneaUsuario),
        enviado: true
    })

    res.redirect('/')
}

//Leer mensajes recibidos
const verMensajes = async (req,res) => {
    
        //Validación
        const {id} = req.params;

        //Validar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id,
            {include: [
                { model: Mensaje, as: 'mensajes',
                    include: [{model: Usuario.scope('eliminarPassword'), as: 'Usuario'}]
                }
            ]}
        );
    
        if(!propiedad){
            return res.redirect('/propiedades/mis-propiedades')
        }
    
        //Revisar que quien visita la url es quien creo la propiedad
        if(propiedad.llaveForaneaUsuario.toString() !== req.usuario.id.toString()){
            return res.redirect('/propiedades/mis-propiedades')
        }

    res.render('propiedades/mensajes',{
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardarPropiedad,
    agregarImagen,
    almacenarImagen,
    editarPropiedad,
    guardarCambios,
    eliminarPropiedad,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}