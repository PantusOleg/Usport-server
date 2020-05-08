import {check} from "express-validator"
import validator from "validator"

const isBoolean = validator.isBoolean

function checkMainUserInfo() {
    return [
        check("email").notEmpty().isEmail().withMessage("Enter correct email"),
        check("fullName").notEmpty().isString().isLength({min: 5, max: 20})
            .withMessage("Full name should be a string more that 5 and less that 20 symbols"),

        check("birthDate").notEmpty().custom(birthDate => {
            const date = new Date(+birthDate)

            if (!(date instanceof Date)) return Promise.reject("Birth date is not correct")
            else return true
        })
    ]
}

const validations = checkMainUserInfo()

export const registerValidation = [
    ...validations,
    check("password").notEmpty().isString().isLength({min: 6, max: 15})
        .withMessage("Password should be a string more that 6 and less than 15 symbols"),
    check("sports").notEmpty().isArray().withMessage("Sports should be an array of strings"),
]

export const updateValidation = [
    ...validations,
    check("confirmed").custom(confirmed => {
        if (!isBoolean(confirmed.toString())) return Promise.reject("Confirmed must to be boolean")
        else return true
    }),
    check("about").custom(about => {
        if (about && typeof about !== "string") return Promise.reject("About field must to be string")
        else return true
    })
]