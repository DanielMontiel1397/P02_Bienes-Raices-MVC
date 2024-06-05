import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombreRegistro: 'Daniel',
        emailRegistro: "daniel@gmail.com",
        confirmado: 1,
        passwordRegistro: bcrypt.hashSync('password',10)
    },
    {
        nombreRegistro: 'Andrea',
        emailRegistro: "andrea@gmail.com",
        confirmado: 1,
        passwordRegistro: bcrypt.hashSync('password',10)
    },
    {
        nombreRegistro: 'Fabiola',
        emailRegistro: "fabiola@gmail.com",
        confirmado: 1,
        passwordRegistro: bcrypt.hashSync('password',10)
    }
]

export default usuarios;