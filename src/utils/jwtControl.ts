import jwt from "jsonwebtoken"

interface ILoginData {
    email: string
    password: string
}

export const createToken = (loginData: ILoginData) =>
    jwt.sign({data: loginData.email}, process.env.JWT_SECRET as string,
        {expiresIn: process.env.JWT_EXPIRES_IN, algorithm: "HS256"})

export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedData) => {
            if (err || !decodedData) return reject(err || new Error("No decoded data"))

            resolve(decodedData)
        })
    })