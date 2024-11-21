import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { ProductRoute } from './modules/product/product.route';
const app: Application = express();

// parser -->
app.use(express.json());

//corse setup :
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.use('/api/products', ProductRoute);


app.get('/', (req: Request, res: Response) => {
  res.send('This api is working');
});

export default app;
