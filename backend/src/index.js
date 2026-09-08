import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// dotenv
dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const FRONTEND_URL = process.env.FRONTEND_URL;

// initialize app variable
const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// databse connection
import con from './db/db.js';

// import router
import router from './router/router.js';

app.listen(PORT,HOST);

app.use('/api',router);

con.connect().then(async () => {
    console.log("Connected at " + PORT);
})