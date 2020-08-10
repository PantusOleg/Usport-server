import {check} from "express-validator"
import validator from "validator"

const isBoolean = validator.isBoolean

const checkMainUserInfo = () => {
    return [
        check("email").notEmpty().isEmail().withMessage("Enter correct email"),
        check("userName").notEmpty().isString().isLength({min: 5, max: 15})
            .withMessage("User name should be a string more than 5 and less than 15 symbols"),
        check("fullName").notEmpty().isString().isLength({min: 5, max: 22})
            .withMessage("Full name should be a string more than 5 and less than 20 symbols"),
        check("avatar").optional().isString(),

        check("birthDate").notEmpty().custom(birthDate => {
            if (!(new Date(birthDate) instanceof Date)) return Promise.reject("Birth date is not correct")
            else return true
        })
    ]
}

const mainValidation = checkMainUserInfo()

export const registerValidation = [
    ...mainValidation,
    check("password").notEmpty().isString().isLength({min: 6, max: 15})
        .withMessage("Password should be a string more than 6 and less than 15 symbols"),
    check("sports").notEmpty().isArray().withMessage("Sports should be an array of numbers"),
]

export const updateValidation = [
    ...mainValidation,
    check("confirmed").custom(confirmed => {
        if (!isBoolean(confirmed.toString())) return Promise.reject("Confirmed should be boolean")
        else return true
    }),
    check("about").optional().isString().isLength({min: 0, max: 300})
        .withMessage("About field must to be string less that 300"),
    check("savedEvents").optional().isArray(),
    check("savedTrainings").optional().isArray()
]

export const loginValidation = [
    check("email").notEmpty().isEmail().withMessage("Enter correct email"),
    check("password").notEmpty().isString().isLength({min: 6, max: 15})
        .withMessage("Password should be a string more than 6 and less than 15 symbols")
]