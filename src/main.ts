import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';

// Boot express
const app: Application = express();

const PORT = process.env.PORT || 3001;

// Application routing

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: '500mb' }));

app.use(`/${process.env.BASE_ROUTE}`, routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
