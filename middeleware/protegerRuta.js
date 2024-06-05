import jwt from 'jsonwebtoken' //Importamos la librearia para crear un token
import { Usuario } from '../models/index.js'; //Importamos Usuario de los modelos

const protegerRuta = async (req,res,next) => {

    //Verificar si hay un token
    /*Ya que cuando iniciamos sesión estamos creando un cookie, se supone que este cookie ya existira en el req,
    asi que buscamos si existe haciendo un destructurin */
    const {_token} = req.cookies

    /*Si no existe los redireccionamos a login */
    if(!_token){
        return res.redirect('/auth/login')
    }

    //Comprobar el token
    /*Si existe el cookie comprobamos si el token es igual al que habiamos creado. */
    try{

        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);
        
        //Almacenar el usuario al Request
        if(usuario){
            req.usuario = usuario
            return next();
            
        } else {
            return res.redirect('/auth/login')
        }

        
    } catch(error){
        return res.clearCookie('_token').redirect('/auth/login')
    }

}  

export default protegerRuta;