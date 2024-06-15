import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config({path:'.env'});

const db = new Sequelize(
    process.env.BD_NOMBRE, //Nombre de la base de datos
    process.env.BD_USER, //Nombre de tú usuario
    process.env.BD_PASS, //Contraseña
    {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT,
        dialect: 'mysql',    //Sequelize soporto varias bases de datos, asi que le indicamos cual usaremos
        define: {
            timestamps: true //Al crear una nueva fila a la tabla, le agrega dos columnas, cuando fue creado y cuando fue actualizado
        }, 
        /*El pool configura  como va a ser el comportamiento para conexiones nuevas o existentes.
        */
        pool: {
            max: 5, //Tiempo máximo de conexiones a mantener de cada usuario.
            min: 0, //Minimo 0
            acquire: 30000, //Son 30 mil milisegundos, es el tiempo que va a pasar tratando de hacer una conexion antes de marcar un error.
            idle: 10000 //Le damos 10 segundos en lo que ve que no hay nada de movimiento para cerrar la conexión.
        },
        operatorsAliases: false
    });

    export default db;