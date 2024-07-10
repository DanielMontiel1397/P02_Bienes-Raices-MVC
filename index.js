import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'; //Importamos la configuración de la Base de Datos.

////////Crear la app////////////
const app = express(); //Contendrá toda la información del servidor que vayamos agregando

//////Habilitar lectura de datos de formulario//////
app.use(express.urlencoded({extended:true}));

///////Habilitar Cookie Parser/////
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({cookie:true}))

//////Conexión a la base de datos/////
try{
    await db.authenticate();
    db.sync();
    console.log('Conexión Correcta a la Base de datos');
} catch(error){
    console.log(error);
}

/////////Habilitar PUG/////////
app.set('view engine','pug');
app.set('views','./views');

///////////Carpeta pública////////
app.use( express.static('public'));

//////////////Routing///////////////
/*Lo que hace esto es que cuando visitemos la / ejecutaremos "routes" que se encuentra en  
uruarioRoutes.js*/
app.use('/auth',usuarioRoutes);

//Routing de Propiedades
app.use('/propiedades',propiedadesRoutes);

//Routing de app
app.use('/',appRoutes);

app.use('/api',apiRoutes)

///////////Definir un puerto y arrancar el proyecto////////////
const port = process.env.PORT || 4000;
 
app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});