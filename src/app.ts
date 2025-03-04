import cors from 'cors';
import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from 'express';
import router from './router';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
const app: Application = express();

// parser -->
app.use(express.json());
app.use(cookieParser());

//corse setup :
const corsOptions = {
  origin: [
    'https://frontend-note-and-nest.vercel.app',
    'http://localhost:5175',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

//routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('This api is working');
});

app.use(globalErrorHandler as unknown as RequestHandler);
app.use(notFound as unknown as RequestHandler);

export default app;
