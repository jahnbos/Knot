import { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Layout onSignOut={() => setIsLoggedIn(false)} />;
}

export default App;
