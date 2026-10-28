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

type Product = { id: number; name: string; price: number };

app.get('/db-sample', async (_req, res) => {
  try {
    const result = await pool.query<Product>(
      'SELECT id, name, price FROM products ORDER BY id'
    );
    res.render('db-sample', { products: result.rows });
  } catch (error) {
    console.error('商品一覧の取得に失敗しました', error);
    res.status(503).send('商品一覧を表示できません');
  }
});

// ------------------------------
// 新規登録機能の追加
// ------------------------------

// 新規登録フォームを表示
app.get('/db-sample/new', (_req, res) => {
  res.render('db-new.ejs');
});

// 新規登録データを受け取りDBに保存
app.post('/db-sample', async (req, res) => {
  const { name, price } = req.body;

  try {
    // 現在の最大IDを取得
    const maxIdResult = await pool.query(
      'SELECT MAX(id) as max_id FROM products'
    );

    const newId = (maxIdResult.rows[0].max_id || 0) + 1;

    // 商品を登録
    await pool.query(
      'INSERT INTO products (id, name, price) VALUES ($1, $2, $3)',
      [newId, name, price]
    );

    res.redirect('/db-sample');
  } catch (error) {
    console.error('商品の登録に失敗しました', error);
    res.status(500).send('商品の登録に失敗しました');
  }
});

// ------------------------------
// 削除機能の追加
// ------------------------------

app.post('/db-sample/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );

    res.redirect('/db-sample');
  } catch (error) {
    console.error('商品の削除に失敗しました', error);
    res.status(500).send('商品の削除に失敗しました');
  }
});

app.listen(port, (): void => {
  console.log(`Server started: http://localhost:${port}`);
});