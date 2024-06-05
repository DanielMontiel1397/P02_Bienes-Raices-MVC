import jwt from 'jsonwebtoken'
//Generar Json WEB Token
const generarJWT = datos => jwt.sign({
        id: datos.id,
        nombre: datos.nombre},
    process.env.JWT_SECRET,{
        expiresIn: '1d'
    })



//Esta linea nos generará un id único a partir de un Date.now
const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarJWT,
    generarId
}