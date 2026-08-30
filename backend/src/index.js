import express from 'express';
import dotenv from 'dotenv';

// dotenv
dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// initialize app variable
const app = express();
app.use(express.json());

// databse connection
import con from './db/db.js';

// import router
import router from './router/router.js';

app.listen(PORT,HOST);

app.use(router);

con.connect().then(async () => {
    console.log("Connected at " + PORT);
})