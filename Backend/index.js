import express from 'express'
import mongoose from 'mongoose'
import userRouter from "./routers/userRouters.js"
import authenticateFirebaseToken from "./middlewares/authMiddleware.js"

const app = express()
const PORT = 9000

mongoose.connect("mongodb://localhost:27017/LinkUp")
.then(()=>console.log("MongoDb connected"))

app.use(express.json())

app.use(authenticateFirebaseToken)

app.use("/api",userRouter)

app.listen(PORT, ()=>console.log(`Server Started at port ${PORT}`))