import nodemailer from 'nodemailer'

const emailRegistroEnvio = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email,nombre,token} = datos;

      //Enviar Email
      await transport.sendMail({
        from: 'Bienes Raices.com',
        to: email,
        subject: `Confirma tú Cuenta en BienesRaices.com`,
        text: 'Confirma tú Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tú cuenta en BienesRaices.com</p>
            <p>Tú cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="https://p02-bienes-raices-mvc.onrender.com/auth/confirmar/${token}">Confirmar Cuenta</a> </p>

            <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
      })
}

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const {email,nombre,token} = datos;

    //Enviar Email
    await transport.sendMail({
      from: 'Bienes Raices.com',
      to: email,
      subject: `Confirma tú Cuenta en BienesRaices.com`,
      text: 'Confirma tú Cuenta en BienesRaices.com',
      html: `
          <p>Hola ${nombre}, has solicitado reestablecer tú password en BienesRaices.com</p>
          <p>Sige el siguiente enlace para generar un password nuevo:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgetPassword/${token}">Restablecer Password</a> </p>

          <p>Si tú no solicitaste el cambio de passsword, puedes ignorar el mensaje</p>
      `
    })
}

export {
    emailRegistroEnvio,
    emailOlvidePassword
}