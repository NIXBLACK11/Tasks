import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import listNFT from './routes/listNFT';
import buyNFT from './routes/buyNFT';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend!');
});

app.use('/api', listNFT);
app.use('/api', buyNFT);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
