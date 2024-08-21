import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import vendingMachineRouter from './routes/vendingMachine.route.js'
import paymentRouter from './routes/payment.route.js'
import userRouter from './routes/user.route.js'



//routes declaration
// app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/carts", cartRouter)

app.use("/api/v1/users", userRouter)
app.use('/api/v1/vending-machines', vendingMachineRouter);
app.use('/api/v1/payments', paymentRouter);

// http://localhost:8000/api/v1/users/register

export { app }