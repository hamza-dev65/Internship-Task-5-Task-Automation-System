import { useState, useEffect } from 'react';
import { getInterns, createIntern, deleteIntern } from '../api';

export default function InternList() {
  const [interns, setInterns] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  const fetchInterns = async () => {
    try { setInterns(await getInterns()); } catch { /* ignore */ }
  };

  useEffect(() => { fetchInterns(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await createIntern({ name, email, department });
    setName(''); setEmail(''); setDepartment('');
    fetchInterns();
  };

  const handleDelete = async (id) => {
    await deleteIntern(id);
    fetchInterns();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Interns</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-gray-600 mb-1">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-gray-600 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-gray-600 mb-1">Department</label>
          <input value={department} onChange={e => setDepartment(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Add</button>
      </form>

      {interns.length === 0 ? (
        <p className="text-gray-500">No interns yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Department</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interns.map(i => (
                <tr key={i._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{i.name}</td>
                  <td className="p-3 text-gray-600">{i.email}</td>
                  <td className="p-3 text-gray-600">{i.department}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(i._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
