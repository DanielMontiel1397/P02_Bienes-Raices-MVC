import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Mensaje = db.define('Mensajes', {
    mensaje: {
        type: DataTypes.STRING(200),
        allowNull:false
    }
});

export default Mensaje;