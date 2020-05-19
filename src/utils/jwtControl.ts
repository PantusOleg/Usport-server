import jwt from "jsonwebtoken"

export const createToken = (id: string) =>
    jwt.sign({id}, process.env.JWT_SECRET as string,
        {expiresIn: process.env.JWT_EXPIRES_IN, algorithm: "HS256"})

export const verifyToken = (token: string) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedData) => {
            if (err || !decodedData) return reject(err || new Error("No decoded data"))

            resolve(decodedData)
        })
    })