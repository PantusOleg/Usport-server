import {check} from "express-validator"
import validator from "validator"

const isBoolean = validator.isBoolean

function checkMainUserInfo() {
    return [
        check("email").notEmpty().isEmail().withMessage("Enter correct email"),
        check("userName").notEmpty().isString().isLength({min: 5, max: 15})
            .withMessage("User name should be a string more than 5 and less than 15 symbols"),
        check("fullName").notEmpty().isString().isLength({min: 5, max: 22})
            .withMessage("Full name should be a string more than 5 and less than 20 symbols"),

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
        .withMessage("Password should be a string more than 6 and less than 15 symbols"),
    check("sports").notEmpty().isArray().withMessage("Sports should be an array of numbers"),
]

export const updateValidation = [
    ...validations,
    check("confirmed").custom(confirmed => {
        if (!isBoolean(confirmed.toString())) return Promise.reject("Confirmed must to be boolean")
        else return true
    }),
    check("about").custom(about => {
        if (about && typeof about !== "string" && about.trim().length <= 100)
            return Promise.reject("About field must to be string less that 100")
        else return true
    })
]

export const loginValidation = [
    check("email").notEmpty().isEmail().withMessage("Enter correct email"),
    check("password").notEmpty().isString().isLength({min: 6, max: 15})
        .withMessage("Password should be a string more than 6 and less than 15 symbols")
]