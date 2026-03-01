import { createContext, useContext, useState, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  // 1. ข้อมูลเดิมที่คุณ Fix ไว้ (Mock Data) สำหรับทดสอบระบบปฏิทินและหน้า Today
  const [tasks, setTasks] = useState([
    { id: 1, title: 'ทำแบบฝึกหัดแคลคูลัส', tags: ['คณิตศาสตร์'], time: '10:00', date: '2026-03-01', status: 'todo', done: false },
    { id: 2, title: 'อ่านบทที่ 5 — เคมีอินทรีย์', tags: ['วิทยาศาสตร์'], time: '11:30', date: '2026-03-01', status: 'todo', done: false },
    { id: 3, title: 'เขียนร่างเรียงความประวัติศาสตร์', tags: ['ประวัติศาสตร์'], time: '13:00', date: '2026-03-01', status: 'todo', done: false },
    { id: 4, title: 'ส่งโปรเจกต์ CS', tags: ['วิทยาศาสตร์'], time: '15:00', date: '2026-03-02', status: 'todo', done: false },
  ]);
  
  // 2. ข้อมูลสำหรับสมุดจดความฟุ้งซ่าน (Distraction Dump)
  const [distractions, setDistractions] = useState([]);

  // ฟังก์ชันเพิ่มงานใหม่: จะเด้งขึ้นทันทีทั้งหน้า Today และ Schedule
  const addTask = useCallback((taskData) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      title: taskData.title || 'ไม่มีชื่อโครงการ',
      tags: taskData.tags || ['ทั่วไป'],
      time: taskData.time || 'ไม่ระบุเวลา',
      // ถ้าไม่ได้เลือกวันที่ ให้เป็นวันที่ปัจจุบันเพื่อให้โชว์ใน Today Page ทันที
      date: taskData.date || today, 
      status: 'todo',
      done: false,
      subtasks: taskData.subtasks || []
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  // ฟังก์ชันสำหรับจดความฟุ้งซ่าน: สำหรับ Persona วอกแวกง่าย
  const addDistraction = useCallback((text) => {
    if (!text.trim()) return;
    const newNote = {
      id: Date.now(),
      text: text,
      timestamp: new Date()
    };
    setDistractions((prev) => [...prev, newNote]);
  }, []);

  // ฟังก์ชันสลับสถานะงาน (ทำเสร็จ / ยังไม่เสร็จ)
  const toggleTaskStatus = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowDone = !t.done;
        return { 
          ...t, 
          done: isNowDone, 
          status: isNowDone ? 'completed' : 'todo' 
        };
      }
      return t;
    }));
  }, []);

  // ฟังก์ชันลบงาน (ถ้าต้องการ)
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      setTasks,
      addTask, 
      toggleTaskStatus, 
      deleteTask,
      distractions, 
      addDistraction,
      setDistractions 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};