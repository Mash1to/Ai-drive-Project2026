import express, { Request, Response } from 'express';
import path from 'path';
import { pool } from './db';

const app = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.get('/', (req: Request, res: Response): void => {
  res.render('index');
});

app.listen(port, (): void => {
  console.log(`Server started: http://localhost:${port}`);
});

app.get('/api/db-check', async (_req, res) => {
  try {
    const result = await pool.query('SELECT 1 AS connection_test');

    res.json({
      status: 'ok',
      database: result.rows[0].connection_test === 1 ? 'connected' : 'error',
    });
  } catch (error) {
    console.error('DB接続確認に失敗しました', error);
    res.status(503).json({
      status: 'error',
      database: 'unavailable',
    });
  }
});