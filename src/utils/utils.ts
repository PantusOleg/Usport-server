import bcrypt from "bcrypt"
import {Response} from "express"

interface ResObjType {
    status: string
    data?: any
    message?: string
}

export const errorRes = (res: Response, status: number, message?: string) =>
    res.status(status).json({status: "error", message})

export const warningRes = (res: Response, message: string) =>
    res.json({status: "error", message})

export const successRes = (res: Response, data?: any, message?: string) => {
    let obj: ResObjType = {status: "success"}

    if (data) obj.data = data
    if (message) obj.message = message

    res.status(200).json(obj)
}

export const isRequired = (val: string) => `${val} is required`

export const generateHash = (str: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
        await bcrypt.hash(str, 10, function (err, hash) {
            if (err) return reject(err)
            resolve(hash)
        })
    })