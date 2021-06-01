import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import cors from 'cors'
import path from 'path'

import createConnection from "./database/connection";
import ErrorRequestHandler from "./errors/handles";
import routes from './routes';


createConnection();

const app = express()

app.use(cors())
app.use(express.json())

app.use("/coverage", express.static(path.resolve(__dirname, "..", "coverage", "lcov-report")))

app.use(routes);

app.use(ErrorRequestHandler);

export default app