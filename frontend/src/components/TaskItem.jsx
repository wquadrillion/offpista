import React from 'react';

const TaskItem = ({ task }) => (
  <div className="border rounded p-3 mb-2 bg-white flex flex-col md:flex-row md:items-center md:justify-between">
    <div>
      <div className="font-semibold">{task.title}</div>
      <div className="text-sm text-gray-500">{task.description}</div>
      <div className="text-xs text-gray-400">Status: {task.status}</div>
    </div>
    {/* Actions (edit/delete) will go here */}
  </div>
);

export default TaskItem;
