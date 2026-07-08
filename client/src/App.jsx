import { useEffect, useState } from 'react';

const emptyEmployee = {
  name: '',
  email: '',
  role: '',
  department: '',
  status: 'Active'
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyEmployee);
  const [message, setMessage] = useState('');

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      setMessage(data.message || 'Employee saved.');
      setForm(emptyEmployee);
      loadEmployees();
    } catch (error) {
      setMessage('Unable to save right now.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">HR Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold">Employee Management System</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Track new hires, update departments, and keep your workforce information organized.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Directory</h2>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                {employees.length} employees
              </span>
            </div>
            <div className="space-y-3">
              {employees.map((employee) => (
                <article key={employee.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-slate-400">{employee.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                      {employee.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                    <span className="rounded-full bg-slate-800 px-2.5 py-1">{employee.role}</span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-1">{employee.department}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Add Employee</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Role"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                placeholder="Department"
                value={form.department}
                onChange={(event) => setForm({ ...form, department: event.target.value })}
                required
              />
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
              <button className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400">
                Save Employee
              </button>
            </form>
            {message ? <p className="mt-4 text-sm text-cyan-300">{message}</p> : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
