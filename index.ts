import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World!');
});

app.listen(port, (): void => {
  console.log(`Server started: http://localhost:${port}`);
});