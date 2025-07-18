import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';

const defaultTask = {
  title: '',
  description: '',
  status: 'pending',
  extras: {},
};

const TaskFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [task, setTask] = useState(defaultTask);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/tasks`).then(res => {
        const found = res.data.find(t => t.id === Number(id));
        if (found) setTask(found);
        else setError('Task not found');
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!task.title.trim()) throw new Error('Title is required');
      if (isEdit) {
        await api.put(`/tasks/${id}`, task);
      } else {
        await api.post('/tasks', task);
      }
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Task' : 'New Task'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title *</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
            minLength={1}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Due Date</label>
            <input
              type="date"
              value={task.extras.due_date || ''}
              onChange={e => setTask(prev => ({
                ...prev,
                extras: { ...prev.extras, due_date: e.target.value }
              }))}
              className="w-full border rounded px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <select
              value={task.extras.priority || ''}
              onChange={e => setTask(prev => ({
                ...prev,
                extras: { ...prev.extras, priority: e.target.value }
              }))}
              className="w-full border rounded px-3 py-2 font-mono priority"
            >
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={Array.isArray(task.extras.tags) ? task.extras.tags.join(', ') : ''}
            onChange={e => setTask(prev => ({
              ...prev,
              extras: { ...prev.extras, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }
            }))}
            className="w-full border rounded px-3 py-2 font-mono"
            placeholder={"work, urgent, home"}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Task')}
        </button>
      </form>
    </div>
  );
};

export default TaskFormPage;
