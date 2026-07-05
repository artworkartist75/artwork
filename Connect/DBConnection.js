import mongoose from "mongoose";
// require('dotenv').config();
import dotenv from "dotenv";

dotenv.config();

export const DBconnect = () => {
    mongoose.connect(process.env.DBURL,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true
    }).then( () => {console.log("DATABASE connected successfully ! ")})
    .catch( (error) => {
        console.error("error is -> ",error);
        console.log("DB not connect");
        process.exit(1);
    })
}