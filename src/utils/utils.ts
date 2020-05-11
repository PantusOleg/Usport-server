import bcrypt from "bcrypt"
import {Response} from "express"

interface ResObjType<S extends string> {
    status: S
    data?: any
    message?: string
}

export const errorRes = (res: Response, status: number, message?: string, data?: any) => {
    let obj: ResObjType<"error"> = {status: "error"}

    if (data) obj.data = data
    if (message) obj.message = message

    res.status(status).json(obj)
}

export const successRes = (res: Response, data?: any, message?: string) => {
    let obj: ResObjType<"success"> = {status: "success"}

    if (data) obj.data = data
    if (message) obj.message = message

    res.json(obj)
}

export const isRequired = (val: string) => `${val} is required`

export const generateHash = (str: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
        await bcrypt.hash(str, 10, function (err, hash) {
            if (err) return reject(err)
            resolve(hash)
        })
    })