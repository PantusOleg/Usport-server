import {model, Schema} from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import {generateHash, isRequired} from "../utils/utils"
import {differenceInMinutes} from "date-fns"
import isEmail = validator.isEmail
import {IUser, UserSchema, IUserModel} from "../types"

const UserSchema = new Schema<UserSchema>({
    email: {
        type: String,
        required: isRequired("Email"),
        validate: [isEmail, "Invalid email"],
        unique: true
    },
    userName: {
        type: String,
        required: isRequired("UserName"),
        unique: true
    },
    avatar: String,
    fullName: {
        type: String,
        required: isRequired("Full name")
    },
    friends: [{
        type: Schema.Types.ObjectId, ref: "User", select: false
    }],
    about: {
        type: String,
        maxlength: 100
    },
    sports: [Number],
    password: {
        type: String,
        required: isRequired("Password"),
        select: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    savedEvents: [{
        type: Schema.Types.ObjectId, ref: "Event", select: false
    }],
    savedTrainings: [{
        type: Schema.Types.ObjectId, ref: "Training", select: false
    }],
    confirmHash: String,
    birthDate: {
        type: Date,
        required: isRequired("Birth date")
    },
}, {versionKey: false})

UserSchema.virtual("confirmed").get(function (this: UserSchema) {
    return !this.confirmHash
})

UserSchema.virtual("isOnline").get(function (this: UserSchema) {
    return differenceInMinutes(Date.now(), this.lastSeen) < 5
})

UserSchema.virtual("friendsCount").get(function (this: UserSchema) {
    return this.friends.length
})

UserSchema.set("toJSON", {virtuals: true})

UserSchema.pre<UserSchema>("save", async function (next) {

    if (!this.isModified("password")) return next()

    try {
        this.password = await generateHash(this.password)
        this.confirmHash = await generateHash(Date.now().toString().slice(0, 7))
    } catch (err) {
        console.log(err.message || err)
    }
})

UserSchema.statics.findWithSaved = async function (id: string) {
    return await this.findById(id).select("savedEvents").select("savedTrainings")
}

UserSchema.statics.comparePasswords = async function (id: string, inputPassword: string) {
    try {
        const {password} = await this.findById(id).select("password")
        return bcrypt.compareSync(inputPassword, password)
    } catch (err) {
        return false
    }
}

export const UserModel = model<IUser, IUserModel>("User", UserSchema)