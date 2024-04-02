import express,{Express,Request,Response,NextFunction } from "express";
import {userRoutes} from "./routes/user";
import { CustomError } from "./classes/custom_error";
import dotenv from "dotenv";
import { sequelize } from "./util/database";
import "./models/assosiaction";
dotenv.config();

const app: Express = express();
app.use("/user",userRoutes);

app.use(
    (error:CustomError,req:Request,res:Response,next:NextFunction) => {
        const status:number = error.satusCode || 500;
         return res.status(status).json({message: error.message});
    }); // might create new folder for errors
const port: string = process.env.PORT|| "4000";

sequelize.sync({force: true}).then(() => {
    app.listen(port)
})
.catch((error: Error) => {
    console.log(error);
});



