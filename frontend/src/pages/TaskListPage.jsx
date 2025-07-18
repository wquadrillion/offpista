import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import TaskItem from '../components/TaskItem';
import TaskFilter from '../components/TaskFilter';
import { Link } from 'react-router-dom';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const filteredTasks = status === 'all' ? tasks : tasks.filter(t => t.status === status);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Task</Link>
      </div>
      <TaskFilter status={status} setStatus={setStatus} />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">
          {error}
          {error === 'Failed to load tasks' && (
            <div className="text-xs mt-2">Are you logged in? Try logging in again.</div>
          )}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-gray-500">No tasks found.</div>
      ) : (
        filteredTasks.map(task => (
          <div key={task.id} className="relative group">
            <TaskItem task={task} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <Link to={`/tasks/${task.id}/edit`} className="text-blue-600 hover:underline mr-2">Edit</Link>
              <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskListPage;
