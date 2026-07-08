import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee API is running' });
});

app.get('/api/employees', async (req, res) => {
  if (!supabase) {
    return res.status(200).json([
      { id: 1, name: 'Alicia Chen', email: 'alicia@company.com', role: 'Product Manager', department: 'Product', status: 'Active' },
      { id: 2, name: 'Marcus Lee', email: 'marcus@company.com', role: 'Software Engineer', department: 'Engineering', status: 'Active' }
    ]);
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, email, role, department, status')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, email, role, department, status } = req.body;
  if (!name || !email || !role || !department) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  if (!supabase) {
    return res.status(201).json({ message: 'Employee saved locally for demo purposes.' });
  }

  try {
    const { error } = await supabase.from('employees').insert({
      name,
      email,
      role,
      department,
      status: status || 'Active'
    });

    if (error) throw error;
    res.status(201).json({ message: 'Employee saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save employee.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
