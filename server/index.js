import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import { dbConfig } from './utils/dbConfig.js';
import cors from 'cors';

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
dotenv.config();

app.use(morgan('dev'));
app.use(cors());
app.get('/', async (req,res)=>{
    res.status(200).json('Server is up and running');
})

//Routes

dbConfig().then(()=>{
    app.listen(port,()=>{
        console.log(`🚀 Server is up and running on port ${port}`);
    })
}).catch((err)=>{
    console.log(err);
})