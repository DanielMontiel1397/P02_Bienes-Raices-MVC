import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './mensaje.js'

Propiedad.belongsTo(Precio, { foreignKey: 'llaveForaneaPrecio', as: 'precio' })
Propiedad.belongsTo(Categoria, { foreignKey: 'llaveForaneaCategoria', as: 'categoria' })
Propiedad.belongsTo(Usuario, { foreignKey: 'llaveForaneaUsuario' })
Propiedad.hasMany(Mensaje, {foreignKey: 'llaveForaneaPropiedad', as: 'mensajes'})

Mensaje.belongsTo(Propiedad, {foreignKey: 'llaveForaneaPropiedad', as: 'Propiedad'})
Mensaje.belongsTo(Usuario, {foreignKey: 'llaveForaneaUsuario', as: 'Usuario'})


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}