import express from "express"
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./routes/user.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import { connectdb } from "./db/connection.js";
import cookieParser from "cookie-parser";

connectdb();

dotenv.config({path: "./.env"});
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/candidate", candidateRouter);

app.listen(port, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
