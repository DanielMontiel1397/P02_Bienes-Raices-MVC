import express from 'express';

//Importar renders del controlador Usuario
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrarUsuario, confirmarEmail, formularioForgetPassword, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js';
const router = express.Router();

//Routing

//Vista de LOGIN
router.get('/login', formularioLogin)
router.post('/login',autenticar)

//Cerrar sesion
router.post('/cerrarSesion',cerrarSesion)

//Vista Registro
router.get('/register',formularioRegistro)
router.post('/register',registrarUsuario)

//confirmar email
router.get('/confirmar/:token',confirmarEmail);

//Vista recuperar contraseña
router.get('/forgetPassword',formularioForgetPassword)
router.post('/forgetPassword',resetPassword)

//Almacena el nuevo password
router.get('/forgetPassword/:token', comprobarToken);
router.post('/forgetPassword/:token', nuevoPassword);

export default router;