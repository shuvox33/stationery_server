import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './router';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parser -->
app.use(express.json());
app.use(cookieParser());

//corse setup :
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('This api is working');
});

export default app;
