import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"; //Importamos Usuario desde el Modelo para poder realizar los Registros
import { generarJWT, generarId } from '../helpers/tokens.js';
import { emailRegistroEnvio } from '../helpers/emails.js';
import { emailOlvidePassword } from '../helpers/emails.js';

//Controlador para vista LOGIN
const formularioLogin = (req,res) => {
    res.render('auth/login',{
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken()
    });
}

const autenticar = async (req,res) => {

    //Validar
    await check('emailInicio').notEmpty().withMessage('El email no puede ir vacio').run(req);
    await check('passwordInicio').notEmpty().withMessage('El password no puede ir vacio').run(req);

    let resultado = validationResult(req);
    console.log(req.body);
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Si no esta vacio, hay errores
        return res.render('auth/login',{
            pagina: "Iniciar Sesión",
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                usuarioEmail: req.body.emailInicio
            }
        })
    }

    //Extraer datos
    const {emailInicio,passwordInicio} = req.body;

    //Validar si el correo existe en la BD
    const usuario = await Usuario.findOne({where: {emailRegistro: emailInicio}});
    if(!usuario){
        return res.render('auth/login',{
            pagina: "Iniciar Sesión",
            errores: [{msg: 'El Usuario no existe'}],
            csrfToken: req.csrfToken(),
            usuario: {
                usuarioEmail: req.body.emailInicio
            }
        })
    }

    //Comprobar si el usuario esta confirmado

    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: "Iniciar Sesión",
            errores: [{msg: "Tú cuenta no ha sido confirmada"}],
            csrfToken: req.csrfToken(),
            usuario: {
                usuarioEmail: req.body.emailInicio
            }
        })
    }

    //Comprobar el Password
    if(!usuario.verificarPassword(passwordInicio)){
        return res.render('auth/login',{
            pagina: "Iniciar Sesión",
            errores: [{msg: "El password es incorrecto"}],
            csrfToken: req.csrfToken(),
            usuario: {
                usuarioEmail: req.body.emailInicio
            }
        })
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombreRegistro});
    
    //Almacenar en un cookie
    return res.cookie('_token',token,{
        httpOnly: true
    }).redirect('/propiedades/mis-propiedades')
}

//Cerrar Sesion
const cerrarSesion = (req,res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

//Controlador para vista REGISTRO
const formularioRegistro = (req,res) => {
    res.render('auth/register',{
        pagina: "Registro",
        csrfToken: req.csrfToken()
    });
}

const registrarUsuario =  async (req,res) =>{
    
    //Validación
    await check('nombreRegistro').notEmpty().withMessage('El Nombre no puede ir vacio').run(req);
    await check('emailRegistro').isEmail().withMessage('No es un email').run(req);
    await check('passwordRegistro').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 carácteres').run(req);
    await check('repetirPaswwordRegistro').equals(req.body.passwordRegistro).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    //Extrar datos
    const {nombreRegistro,emailRegistro,passwordRegistro, repetirPasswordRegistro} = req.body;

    //Verificar que el resultado esta vacio

    if(!resultado.isEmpty()){
        //Si no esta vacio, hay errores
        return res.render('auth/register',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: nombreRegistro,
                email: emailRegistro
            }
        })
    }

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne( { where: {emailRegistro: emailRegistro}});
   
    if(existeUsuario){
        return res.render('auth/register',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El Usuario ya existe"}],
            usuario: {
                nombre: nombreRegistro,
                email: emailRegistro
            }
        })
    }
    
    //En caso de que este vacio creamos el usuario, ya que no hay ningún error
     const usuario = await Usuario.create({
        nombreRegistro,
        emailRegistro,
        passwordRegistro,
        token: generarId()
    });

    //Envia email de confirmación
    emailRegistroEnvio({
        nombre: usuario.nombreRegistro,
        email: usuario.emailRegistro,
        token: usuario.token
    })

    //Mostrar Mensaje de Confirmación de email
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: "Hemos Enviado un Email de Confirmación, presiona en el enlace"
    })
}

//Confirmar Email al Enviarlo
const confirmarEmail = async (req,res) => {

    const {token} = req.params;
    
    //Verificar si el token es válido 

    const usuario = await Usuario.findOne({where: {token} });
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al confirmar tú cuenta',
            mensaje: 'Hubo un error al confirmar tú cuenta, intenta de nuevo',
            error: true
        })
    }

    //Confirmar la Cuenta;
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: "Cuenta Confirmada",
        mensaje: 'La cuenta se confirmó correctamente',
        error: false
    })
}

//Controlador para vista OLVIDE CONTRASEÑA
const formularioForgetPassword = (req,res) => {
    res.render('auth/olvidar-password',{
        pagina: "Recuperar contraseña",
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req,res) => {
        //Validación
        await check('emailRegistro').isEmail().withMessage('No es un email').run(req);

        let resultado = validationResult(req);
    
        //Extrar datos
        const {emailRegistro} = req.body;
    
        //Verificar que el resultado esta vacio
    
        if(!resultado.isEmpty()){
            //Si no esta vacio, hay errores
            return res.render('auth/olvidar-password',{
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: resultado.array()
            })
        }

        //Buscar Usuario en caso de que sea email válido
        const usuario = await Usuario.findOne({where: {emailRegistro}});
        
        //Si el usuario con ese email no existe
        if(!usuario){
            return res.render('auth/olvidar-password',{
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'El Email no pertenece a ningún Usuario'}]
            })
        }

        //Generar token en caso de que el email si sea válido
        usuario.token = generarId();
        await usuario.save();

        //Enviar un email
        emailOlvidePassword({
            email: usuario.emailRegistro,
            nombre: usuario.nombreRegistro,
            token: usuario.token
        })

        //Renderizar un mensaje para revisar instrucciones
        res.render('templates/mensaje',{
            pagina: 'Reestablece tú password',
            mensaje: 'Hemos enviado un email con las instrucciones'
        })
       
}

const comprobarToken = async (req,res) => {
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}});
    
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Reestablece tú Password',
            mensaje: 'Hubo un error al validar tú información, intenta de nuevo',
            error: true
        })
    }

    //Mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        pagina: "Reestablece tú Password",
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req,res) => {

    //Validar el password
    await check('newPassword').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 carácteres').run(req);
    
    let resultado = validationResult(req);

    //Extrar datos
    const {newPassword} = req.body;
    const {token} = req.params;

    //Verificar que el resultado esta vacio

    if(!resultado.isEmpty()){
        //Si no esta vacio, hay errores
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tú Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}});

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.passwordRegistro = await bcrypt.hash(newPassword, salt);
    usuario.token = null;

    usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardo Correctamente'
    })

}



export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrarUsuario,
    confirmarEmail,
    formularioForgetPassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}