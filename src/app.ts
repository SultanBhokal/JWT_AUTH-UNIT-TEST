import express, { Request, Response } from 'express';
import cors from "cors";
import authRoutes from "./routes/auth/config"
import * as dotenv from "dotenv"
import cookieParser from "cookie-parser";
import {connectWithRetry} from "./service/mongooseService"
const port = 3000;
const app = express();

// env config
dotenv.config()

// middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// services
if(process.env.NODE_ENV !== "test"){
  connectWithRetry()
}

// routes
app.use("/api/users",authRoutes)


// listening 
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, There .');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app;
