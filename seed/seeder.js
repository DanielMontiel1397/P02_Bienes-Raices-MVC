import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import propiedades from "./propiedad.js"
import {Categoria,Precio,Usuario,Propiedad} from "../models/index.js"
import db from "../config/db.js";

const importarDatos = async () => {
    try{
        //Autenticar
        await db.authenticate();

        //Generar las Columnas
        await db.sync();

        //Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios),
            Propiedad.bulkCreate(propiedades)])
        
        console.log('Datos importados Correctamente');
        process.exit();

    } catch(error){
        console.log(error);
        process.exit(1)
    }
}


const eliminarDatos = async () => {
    try{
        await db.sync({force: true});
        console.log('Datos eliminados Correctamente');
        process.exit(0)

    }catch(error){
        console.log(error);
        process.exit(1)
    }
}
if(process.argv[2] === "-i"){
    importarDatos();
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}