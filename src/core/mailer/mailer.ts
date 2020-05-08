import nodemailer from "nodemailer"
import fs from "fs"

const options = {
    pool: true,
    host: process.env.NODEMAILER_HOST,
    port: +(process.env.NODEMAILER_PORT || 465),
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
}

const mailer = nodemailer.createTransport(options)

export const sendVerifyMessage = (email: string, confirmHash: string) => {

    mailer.sendMail({
            from: "admin@usport.com",
            to: email,
            subject: "Verifying your email in Usport",
            html: `This your confirmHash: ${confirmHash}`
        },
        (err, info) => {
            if (err) fs.appendFile("src/core/mailer/mailer.log", err.message, () => null)
        })
}

export default mailer
