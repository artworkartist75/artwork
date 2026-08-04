import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { DBconnect } from './Connect/DBConnection.js';
import { cloudinary_connect } from './Connect/cloudinary.js';
import getArtistData from './Routes/atrtistRoute/getArtistData.js';
import uploadData from './Routes/atrtistRoute/uploadData.js';
import updateData from './Routes/atrtistRoute/updateData.js';
import deleteData from './Routes/atrtistRoute/deleteData.js';
import getuserdata from './Routes/userRoute/getUserData.js';
import userAuth from './Routes/authenticate/userAuth.js';
const app = express();
configDotenv();

const PORT = process.env.PORT || 3000;
app.use(express.json());

const corsOptions = {
  origin: ["https://sachinartwork.vercel.app","https://updateartwork.vercel.app","http://localhost:4173","http://localhost:5173"], // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/Artist/get', getArtistData);
app.use('/api/v1/Artist/upload', uploadData);
app.use('/api/v1/Artist/update', updateData);
app.use('/api/v1/Artist/delete', deleteData);
app.use('/api/v1/User/data', getuserdata);
app.use('/api/v1/Artist/authenticate/user/', userAuth);

app.get('/', (req, res) => {
  res.send('Hello ArtWork World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

DBconnect();
cloudinary_connect();