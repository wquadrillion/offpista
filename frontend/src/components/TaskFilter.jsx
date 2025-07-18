import React from 'react';

const TaskFilter = ({ status, setStatus }) => (
  <div className="mb-4 flex gap-2">
    {['all', 'pending', 'in-progress', 'done'].map(s => (
      <button
        key={s}
        className={`px-3 py-1 rounded ${status === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setStatus(s)}
      >
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </button>
    ))}
  </div>
);

export default TaskFilter;
