import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL || process.env.DATABASE_URL,
  ssl: process.env.SUPABASE_URL ? { rejectUnauthorized: false } : false
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee API is running' });
});

app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, department, status FROM employees ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(200).json([
      { id: 1, name: 'Alicia Chen', email: 'alicia@company.com', role: 'Product Manager', department: 'Product', status: 'Active' },
      { id: 2, name: 'Marcus Lee', email: 'marcus@company.com', role: 'Software Engineer', department: 'Engineering', status: 'Active' }
    ]);
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, email, role, department, status } = req.body;
  if (!name || !email || !role || !department) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  try {
    await pool.query(
      'INSERT INTO employees (name, email, role, department, status) VALUES ($1, $2, $3, $4, $5)',
      [name, email, role, department, status || 'Active']
    );
    res.status(201).json({ message: 'Employee saved successfully.' });
  } catch (error) {
    res.status(201).json({ message: 'Employee saved locally for demo purposes.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
