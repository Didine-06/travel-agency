import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRouter from './Routes/AppRouter';
import ThemeDebug from './Components/ThemeDebug';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
          {/* Composant de debug - À supprimer après test */}
          <ThemeDebug />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
