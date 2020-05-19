import {check} from "express-validator"
import {types} from "util"

export const eventValidation = [
    check("creator").notEmpty().withMessage("Enter correct creator"),
    check("title").notEmpty().isString().isLength({min: 3, max: 50}),
    check("description").notEmpty().isString().isLength({min: 5, max: 100}),
    check("location").notEmpty(),
    check("sports").custom(sports => {
        if (!sports || types.isInt8Array(sports)) return true
        else return Promise.reject("Sports should be an array of numbers")
    }),
    check("filterMembers").notEmpty().isBoolean(),
    check("date").notEmpty().custom(date => {
        if (new Date(date) instanceof Date) return true
        else return Promise.reject("Incorrect date")
    })
]