import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Propiedad = db.define('propiedades', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        tituloPropiedad: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcionPropiedad: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        habitacionesPropiedad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estacionamientoPropiedad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        wcPropiedad: {
            type: DataTypes.INTEGER,
            allowNull:false
        }, 
        calle: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        lat: {
            type: DataTypes.STRING,
            allowNull:false
        },
        lng: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagen_id: {
            type:DataTypes.STRING
        },
        publicado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }

)

export default Propiedad;