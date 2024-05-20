import express from "express"
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config({path: "./.env"});
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({mess : "afdada"});
})

app.listen(port, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
