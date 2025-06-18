import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser({limit : '16kb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true , limit: '16kb'}));
app.use(express.static('public'));

export {app};