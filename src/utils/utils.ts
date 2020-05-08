import bcrypt from "bcrypt"
import {Response} from "express"

interface SuccessObjType {
    status: "success"
    data?: any
    message?: string
}

export const errorRes = (res: Response, status: number, message: string) =>
    res.status(status).json({status: "error", message})

export const successRes = (res: Response, data?: any, message?: string) => {
    const obj: SuccessObjType = {status: "success"}

    if (data) obj.data = data
    if (message) obj.message = message

    res.json(obj)
}

export const isRequired = (val: string) => `${val} is required`

export const generateHash = (str: string): Promise<string> =>
    new Promise((resolve, reject) => {
        bcrypt.hash(str, 10, function (err, hash) {
            if (err) return reject(err)
            resolve(hash)
        })
    })