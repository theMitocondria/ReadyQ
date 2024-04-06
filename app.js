import express from "express";
import dotenv from "dotenv";
import Database from "./Database.js";
import UserRoutes from "./routes/User.js";
import  Interview  from "./routes/Interview.js";

const app = express();
dotenv.config();


app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use("/user", UserRoutes)
app.use("/interview", Interview)

Database();

app.listen(process.env.PORT, () => console.log("server connected to 4000"));