import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { ArrowLeft, User, Phone, Calendar, MapPin, Mail, Lock, Check, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../Context/ThemeContext';
import LanguageSelect from '../../Components/common/LanguageSelect';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error for this field
    setValidationErrors(prev => ({...prev, [name]: undefined}));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = t('auth.register.errors.firstNameRequired');
    } else if (formData.firstName.length < 2) {
      errors.firstName = t('auth.register.errors.firstNameTooShort');
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = t('auth.register.errors.lastNameRequired');
    } else if (formData.lastName.length < 2) {
      errors.lastName = t('auth.register.errors.lastNameTooShort');
    }
    
    if (!formData.phone.trim()) {
      errors.phone = t('auth.register.errors.phoneRequired');
    } else if (!validatePhone(formData.phone)) {
      errors.phone = t('auth.register.errors.phoneInvalid');
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = t('auth.register.errors.dateOfBirthRequired');
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = t('auth.register.errors.ageRestriction');
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.email.trim()) {
      errors.email = t('auth.register.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      errors.email = t('auth.register.errors.emailInvalid');
    }
    
    if (!formData.password.trim()) {
      errors.password = t('auth.register.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('auth.register.errors.passwordTooShort');
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = t('auth.register.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.register.errors.passwordMismatch');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setError('');
    
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError('');
    setValidationErrors({});
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateStep3()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await api.auth.register(registerData);
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.message?.includes('email')) {
        setError(t('auth.register.errors.emailExists'));
      } else {
        setError(t('auth.register.errors.registrationFailed'));
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold transition-all text-sm sm:text-base ${
              step === currentStep
                ? 'bg-blue-600 text-white shadow-lg scale-110'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
            }`}
          >
            {step < currentStep ? <Check size={18} className="sm:w-5 sm:h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 transition-all ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">{t('auth.register.step1Title')}</h2>
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.firstName')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder={t('auth.register.placeholders.firstName')}
            required
          />
        </div>
        {validationErrors.firstName && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.firstName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.lastName')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder={t('auth.register.placeholders.lastName')}
            required
          />
        </div>
        {validationErrors.lastName && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.lastName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.phone')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('auth.register.placeholders.phone')}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            required
          />
        </div>
        {validationErrors.phone && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
        )}
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.dateOfBirth')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            required
          />
        </div>
        {validationErrors.dateOfBirth && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.dateOfBirth}</p>
        )}
      </div>
      
      <button
        type="button"
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] font-semibold shadow-lg text-sm sm:text-base"
      >
        {t('auth.register.next')}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">{t('auth.register.step2Title')}</h2>
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.address')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t('auth.register.placeholders.address')}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.city')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder={t('auth.register.placeholders.city')}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.country')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={t('auth.register.placeholders.country')}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="w-1/2 bg-gray-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold text-sm sm:text-base"
        >
          {t('auth.register.previous')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] font-semibold shadow-lg text-sm sm:text-base"
        >
          {t('auth.register.next')}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">{t('auth.register.step3Title')}</h2>
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.email')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder={t('auth.register.placeholders.email')}
            required
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
        )}
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.password')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder={t('auth.register.placeholders.password')}
            required
          />
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
        )}
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t('auth.register.confirmPassword')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder={t('auth.register.placeholders.password')}
            required
          />
        </div>
        {validationErrors.confirmPassword && (
          <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="w-1/3 bg-gray-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 transition-all font-semibold text-sm sm:text-base"
        >
          {t('auth.register.previous')}
        </button>
        <button
          type="submit"
          className="w-2/3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] font-semibold shadow-lg text-sm sm:text-base"
        >
          {t('auth.register.submit')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-2 sm:p-4 transition-colors">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-2 sm:my-0 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Form Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 sm:p-6 md:p-16 flex flex-col justify-center overflow-y-auto max-h-screen transition-colors">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={() => navigate('/')}
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">{t('auth.register.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8">{t('auth.register.subtitle')}</p>
            
            {renderStepIndicator()}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6">
                <p className="font-medium text-sm sm:text-base">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
            
            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline">
                {t('auth.register.signIn')}
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden md:block relative bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-purple-900 dark:to-indigo-950 transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000"
              alt="Travel Registration"
              className="w-full h-full object-cover opacity-90 dark:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
              <div className="text-white">
                <h2 className="text-5xl font-bold mb-4">{t('auth.register.heroTitle')}</h2>
                <p className="text-xl text-gray-200">{t('auth.register.heroSubtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
