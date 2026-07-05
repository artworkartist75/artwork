// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

export const cloudinary_connect = () =>{
    try{
        if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
            throw new Error('Cloudinary environment variables are missing');
        }
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.API_SECRET
        })
        // console.log('cloud connect');
        cloudinary.api.ping()
        .then((result) => console.log('Cloudinary connection successful:', result))
        .catch((err) => console.error('Cloudinary connection failed:', err));

    }catch(error){
        console.log(error);
    }
}