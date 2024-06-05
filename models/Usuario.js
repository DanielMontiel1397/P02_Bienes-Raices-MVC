import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

/* Mandamos a llamar a nuestra instancia, usamos define para crear la tabla que queramos
y agregamos las columnas que tendrá nuestra tabla*/
const Usuario = db.define('usuarios', {
    nombreRegistro: {
        type: DataTypes.STRING,
        allowNull: false //Esto quiere decir que ese campo no vaya vacio
    },
    emailRegistro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordRegistro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING
    },
    confirmado: {
        type: DataTypes.BOOLEAN
    }
}, {
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.passwordRegistro = await bcrypt.hash(usuario.passwordRegistro, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['passwordRegistro','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

//Metodos personalizados
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordRegistro)
}
export default Usuario;