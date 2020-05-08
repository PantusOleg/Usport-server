import nodemailer from "nodemailer"

const options = {
    host: process.env.NODEMAILER_HOST,
    port: +(process.env.NODEMAILER_PORT || 465),
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
}

export default nodemailer.createTransport(options)
