import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// dotenv
dotenv.config();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// initialize app variable
const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// databse connection
import con from './db/db.js';

// import router
import router from './router/router.js';

app.get('/', (req,res) => {
  return res.send("Server is Ready");
})

app.use('/api',router);
app.listen(PORT, () => {
  con.connect().then(async () => {
    console.log("Connected at " + PORT);
  })
});
