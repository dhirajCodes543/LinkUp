import express from 'express'
import mongoose from 'mongoose'
import userRouter from "./routers/userRouters.js"
import authenticateFirebaseToken from "./middlewares/authMiddleware.js"
import startWebSocketServer from './webSocketServer.js'
import http from 'http'
import dotenv from 'dotenv';
dotenv.config();


const app = express()
const PORT = process.env.PORT || 9000
app.use(authenticateFirebaseToken)

const server = http.createServer(app)

startWebSocketServer(server)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDb connected"))

app.use(express.json())

app.use("/api", userRouter)

server.listen(PORT, () => console.log(`HTTP & WebSocket server running on http://localhost:${PORT}`))