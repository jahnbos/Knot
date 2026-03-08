import { createContext, useContext, useState, useCallback } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  // 1. ข้อมูลเดิมที่คุณ Fix ไว้ (Mock Data) สำหรับทดสอบระบบปฏิทินและหน้า Today
  const [tasks, setTasks] = useState([
    { id: 1, title: 'ทำแบบฝึกหัดแคลคูลัส', task: 'คณิตศาสตร์', time: '10:00', date: '2026-03-01', status: 'todo', done: false, priority: 'high', subtasks: [{ id: 101, text: 'ทบทวนสูตรดิฟฟ์', done: true }, { id: 102, text: 'ทำโจทย์ข้อ 1-10', done: false }] },
    { id: 2, title: 'อ่านบทที่ 5 — เคมีอินทรีย์', task: 'วิทยาศาสตร์', time: '11:30', date: '2026-03-01', status: 'todo', done: false, priority: 'medium' },
    { id: 3, title: 'เขียนร่างเรียงความประวัติศาสตร์', task: 'ประวัติศาสตร์', time: '13:00', date: '2026-03-01', status: 'todo', done: false, priority: 'low' },
    { id: 4, title: 'ส่งโปรเจกต์ CS', task: 'วิทยาศาสตร์', time: '15:00', date: '2026-03-02', status: 'todo', done: false, priority: 'high' },
    { id: 5, title: 'เตรียมพรีเซนต์งานกลุ่ม', task: 'อื่นๆ', time: '09:00', date: '2026-03-10', status: 'todo', done: false, priority: 'high', subtasks: [{ id: 501, text: 'ทำสไลด์ Intro', done: false }, { id: 502, text: 'บรีฟเพื่อนในกลุ่ม', done: false }] },
    { id: 6, title: 'นัดคุยโปรเจกต์กับอาจารย์', task: 'ทั่วไป', time: '14:30', date: '2026-03-15', status: 'todo', done: false, priority: 'medium' },
    { id: 7, title: 'ทบทวนคำศัพท์ภาษาอังกฤษ', task: 'ภาษาอังกฤษ', time: '20:00', date: '2026-03-20', status: 'todo', done: false, priority: 'low' },
    { id: 8, title: 'ซ้อมแข่งตอบปัญหา', task: 'วิทยาศาสตร์', time: '16:00', date: '2026-03-25', status: 'todo', done: false, priority: 'high' },
    { id: 9, title: 'สรุปรายรับรายจ่ายเดือนนี้', task: 'ทั่วไป', time: '18:00', date: '2026-03-31', status: 'todo', done: false, priority: 'medium' },
    { id: 10, title: 'อ่านหนังสือ UX/UI Design', task: 'การศึกษา', time: '08:00', date: '2026-03-05', status: 'todo', done: false, priority: 'medium' },
    { id: 11, title: 'ออกกำลังกายที่สวนสาธารณะ', task: 'สุขภาพ', time: '17:00', date: '2026-03-08', status: 'todo', done: false, priority: 'low' },
    { id: 12, title: 'ซื้อของเข้าบ้าน', task: 'ทั่วไป', time: '11:00', date: '2026-03-12', status: 'todo', done: false, priority: 'low' },
    { id: 13, title: 'เรียนคอร์สออนไลน์ React Advanced', task: 'การศึกษา', time: '13:00', date: '2026-03-18', status: 'todo', done: false, priority: 'high' },
    { id: 14, title: 'ฟัง Podcast พัฒนาตัวเอง', task: 'ทั่วไป', time: '08:00', date: '2026-03-22', status: 'todo', done: false, priority: 'low' },
    { id: 15, title: 'วางแผนเที่ยวสงกรานต์', task: 'ทั่วไป', time: '21:00', date: '2026-03-28', status: 'todo', done: false, priority: 'medium' },
  ]);
  
  // 2. ข้อมูลสำหรับสมุดจดความฟุ้งซ่าน (Distraction Dump)
  const [distractions, setDistractions] = useState([]);

  // ฟังก์ชันเพิ่มงานใหม่: จะเด้งขึ้นทันทีทั้งหน้า Today และ Schedule
  const addTask = useCallback((taskData) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const newTask = {
      id: Date.now(),
      title: taskData.title || 'ไม่มีชื่อโครงการ',
      task: taskData.task || 'ทั่วไป',
      time: taskData.time || 'ไม่ระบุเวลา',
      // ถ้าไม่ได้เลือกวันที่ ให้เป็นวันที่ปัจจุบันเพื่อให้โชว์ใน Today Page ทันที
      date: taskData.date || today, 
      priority: taskData.priority || 'medium',
      status: 'todo',
      done: false,
      timerDuration: taskData.timerDuration || 25,
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

  // ฟังก์ชันอัปเดตงาน
  const updateTask = useCallback((id, updatedFields) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      setTasks,
      addTask, 
      toggleTaskStatus, 
      deleteTask,
      updateTask,
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