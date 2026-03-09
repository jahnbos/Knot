import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext'; // เพิ่มการ Import
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage'; // ปรับเป็น PascalCase ให้ตรงกับไฟล์จริง

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      {/* หุ้มด้วย TaskProvider เพื่อให้ข้อมูลงานซิงค์กันทุกหน้าเมื่อ Login แล้ว */}
      <TaskProvider> 
        {isLoggedIn ? (
          <Layout onSignOut={() => setIsLoggedIn(false)} />
        ) : (
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        )}
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;