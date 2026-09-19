import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import LoginGate from './components/LoginGate';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginGate>
      {(account, schoolProfile, logout) => <App account={account} schoolProfile={schoolProfile} onLogout={logout} />}
    </LoginGate>
  </StrictMode>,
);
