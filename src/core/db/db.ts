import fs from "fs"
import mongoose from "mongoose"

try {
    mongoose.connect(process.env.MONGO_CONNECT_URL || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log("Mongo connected"))
} catch (err) {
    fs.appendFile("src/core/db/mongo.log", err.message || err, () => null)
    console.log("Mongo connection error")
}