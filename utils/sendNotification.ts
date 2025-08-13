import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendEmailNotification = async (to: string, subject: string, text: string) => {
  await sgMail.send({
    to,
    from: process.env.FROM_EMAIL!,
    subject,
    text,
  })
}
