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
  from: '"BienesRaices.com" <no-reply@bienesraices.com>',
  to: email,
  subject: `Confirma tu cuenta en BienesRaices.com`,
  text: 'Confirma tu cuenta en BienesRaices.com',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">BienesRaices.com</h1>
        </div>

        <div style="padding: 30px; color: #333;">
          <p style="font-size: 18px;">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.5;">
            Gracias por registrarte en <strong>BienesRaices.com</strong>.  
            Tu cuenta ya está casi lista, solo necesitas confirmarla dando clic en el siguiente botón:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/confirmar/${token}"
              style="background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Confirmar Cuenta
            </a>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #555;">
            Si tú no creaste esta cuenta, puedes ignorar este mensaje sin problema.
          </p>
    
        </div>
      </div>
    </div>
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
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/forgetPassword/${token}">Restablecer Password</a> </p>

          <p>Si tú no solicitaste el cambio de passsword, puedes ignorar el mensaje</p>
      `
    })
}

export {
    emailRegistroEnvio,
    emailOlvidePassword
}