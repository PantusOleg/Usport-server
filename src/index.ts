import express from "express"
import dotenv from "dotenv"

dotenv.config()

import "./core/db/db"
import {useRoutes} from "./core/routes/router"

const app = express()

useRoutes(app)

app.listen(process.env.PORT, () => console.log(`I am started on port ${process.env.PORT}`))
