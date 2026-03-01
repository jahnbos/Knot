import { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [distractions, setDistractions] = useState([]); // สำหรับ Persona สายสมาธิสั้น

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      status: 'todo',
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const addDistraction = (text) => {
    setDistractions((prev) => [...prev, { id: Date.now(), text, time: new Date() }]);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, distractions, addDistraction }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);