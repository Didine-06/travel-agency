import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../Context/ThemeContext';
import LanguageSelect from '../../Components/common/LanguageSelect';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email.trim()) {
      errors.email = t('auth.login.errors.emailRequired');
    } else if (!validateEmail(email)) {
      errors.email = t('auth.login.errors.emailInvalid');
    }
    
    if (!password.trim()) {
      errors.password = t('auth.login.errors.passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('auth.login.errors.passwordTooShort');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.errors.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-colors">
        <div className="grid md:grid-cols-2">
          {/* Form Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-8 md:p-16 flex flex-col justify-center transition-colors">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">{t('common.back')}</span>
              </button>
              
              <div className="flex items-center gap-2">
                <LanguageSelect />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('auth.login.title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t('auth.login.subtitle')}</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('auth.login.email')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors(prev => ({...prev, email: undefined}));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder={t('auth.register.placeholders.email')}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('auth.login.password')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationErrors(prev => ({...prev, password: undefined}));
                    }}
                    className={`w-full pl-10 pr-4 py-3 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold shadow-lg"
              >
                {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-indigo-900 dark:to-purple-900 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000"
              alt="Travel"
              className="w-full h-full object-cover opacity-90 dark:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
              <div className="text-white">
                <h2 className="text-5xl font-bold mb-4">{t('auth.login.heroTitle')}</h2>
                <p className="text-xl text-gray-200">{t('auth.login.heroSubtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
