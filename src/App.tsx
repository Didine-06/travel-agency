import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import AppRouter from './Routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
