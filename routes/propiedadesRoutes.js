import express from 'express';
import { admin,crear, guardarPropiedad, agregarImagen, almacenarImagen, editarPropiedad, guardarCambios,eliminarPropiedad, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadesController.js';
import { identificarUsuario } from '../middeleware/identificarUsuario.js';
import protegerRuta from '../middeleware/protegerRuta.js';
import upload from '../middeleware/subirImagen.js';

import { body } from 'express-validator';

const router = express.Router();

router.get('/mis-propiedades',protegerRuta, admin)

router.get('/crear',protegerRuta,crear);
router.post('/crear',protegerRuta,
    body('tituloPropiedad').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcionPropiedad')
        .notEmpty().withMessage('La Descripción del Anuncio es Obligatorio')
        .isLength({max: 200}).withMessage("La Descripción es Muy Larga"),
    body('categoriaPropiedad').isNumeric().withMessage('La Categoría del Anuncio es Obligatorio'),
    body('precioPropiedad').isNumeric().withMessage('El Precio del Anuncio es Obligatorio'),
    body('habitacionesPropiedad').isNumeric().withMessage('La cantidad de Habitaciones del Anuncio es Obligatorio'),
    body('estacionamientoPropiedad').isNumeric().withMessage('La cantidad de Estacionamientos del Anuncio es Obligatorio'),
    body('wcPropiedad').isNumeric().withMessage('La cantidad de WC del Anuncio es Obligatorio'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),
    guardarPropiedad
);

router.get('/agregar-imagen/:id',protegerRuta,agregarImagen);
router.post('/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/editar-propiedad/:id', protegerRuta, editarPropiedad)
router.post('/editar-propiedad/:id',protegerRuta,
    body('tituloPropiedad').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio'),
    body('descripcionPropiedad')
        .notEmpty().withMessage('La Descripción del Anuncio es Obligatorio')
        .isLength({max: 200}).withMessage("La Descripción es Muy Larga"),
    body('categoriaPropiedad').isNumeric().withMessage('La Categoría del Anuncio es Obligatorio'),
    body('precioPropiedad').isNumeric().withMessage('El Precio del Anuncio es Obligatorio'),
    body('habitacionesPropiedad').isNumeric().withMessage('La cantidad de Habitaciones del Anuncio es Obligatorio'),
    body('estacionamientoPropiedad').isNumeric().withMessage('La cantidad de Estacionamientos del Anuncio es Obligatorio'),
    body('wcPropiedad').isNumeric().withMessage('La cantidad de WC del Anuncio es Obligatorio'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),
    guardarCambios
);

router.post('/eliminar-propiedad/:id',protegerRuta,eliminarPropiedad)

router.put('/mis-propiedades/:id',
    protegerRuta,
    cambiarEstado
)

//Area pública
router.get('/propiedad/:id',identificarUsuario, mostrarPropiedad)

//Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)
export default router;