import cors from 'cors'
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

app.use(express.json())

app.use(cors({
  origin: 'https://linkupfrontend-ed87.onrender.com',
  credentials: true, // if you're using cookies/auth
}));
// add this BEFORE authenticateFirebaseToken
app.get("/api/ping", (req, res) => res.json({ ok: true }));

app.use(authenticateFirebaseToken)

const server = http.createServer(app)

startWebSocketServer(server)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDb connected"))


app.use("/api", userRouter)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP & WebSocket server running on http://0.0.0.0:${PORT}`);
});
