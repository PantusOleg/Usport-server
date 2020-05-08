import {Document, Model, Schema} from "mongoose"
import validator from "validator"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import isEmail = validator.isEmail
import {generateHash, isRequired} from "../utils/utils"
import {differenceInMinutes} from "date-fns"

interface UserSchema extends Document {
    email: string
    avatar: string
    fullName: string
    about: string
    sports: Array<string>
    password: string
    lastSeen: Date
    confirmed: boolean
    confirmHash: string
    birthDate: Date
}

export interface IUser extends UserSchema {
    isOnline: boolean
}

interface IUserModel extends Model<IUser> {
    comparePasswords(id: string, password: string): boolean
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: isRequired("Email"),
        validate: [isEmail, "Invalid email"],
        unique: true
    },
    avatar: String,
    fullName: {
        type: String,
        required: isRequired("Full name")
    },
    about: {
        type: String,
        maxlength: 100
    },
    sports: [String],
    password: {
        type: String,
        required: isRequired("Password"),
        select: false,
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmHash: String,
    birthDate: {
        type: Date,
        required: isRequired("Birth date")
    },
})

UserSchema.virtual("isOnline").get(function (this: UserSchema) {
    return differenceInMinutes(Date.now(), this.lastSeen) < 5
})

UserSchema.set("toJSON", {virtuals: true})

UserSchema.pre<IUser>("save", async function (next) {

    if (!this.isModified("password")) return next()

    try {
        this.password = await generateHash(this.password)
        this.confirmHash = await generateHash(Date.now().toString())
    } catch (err) {
        console.log(err.message || err)
    }
})

UserSchema.statics.comparePasswords = async function (id: string, password: string) {
    try {
        return await bcrypt.compareSync(password, this.findById(id).password)
    } catch (err) {
        return new Error("Error with comparing passwords")
    }
}

export const UserModel = mongoose.model<IUser, IUserModel>("User", UserSchema)