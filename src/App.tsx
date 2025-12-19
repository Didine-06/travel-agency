import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { LanguageProvider } from './Context/LanguageContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRouter from './Routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <AppRouter />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
