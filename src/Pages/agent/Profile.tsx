import { useEffect, useState } from 'react';
import { User as UserIcon, MapPin, Calendar, Phone, Mail, Home, Globe } from 'lucide-react';
import { api } from '../../api';
import type { User } from '../../types';
import { useTheme } from '../../Context/ThemeContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const AgentProfile = () => {
  useTheme();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getCurrentUser();
      if (response.isSuccess && response.data) {
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
          country: response.data.country || '',
          dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : ''
        });
      }
    } catch (err) {
      setError(t('common.errorLoadingProfile'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user?.id) {
      setError(t('common.missingUserId'));
      return;
    }

    try {
      const updateData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        languageId: user.languageId,
        isActive: user.isActive,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        dateOfBirth: formData.dateOfBirth || undefined
      };

      const response = await api.auth.updateProfile(user.id, updateData);
      
      if (response.isSuccess && response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast.success(t('common.profileUpdated'));
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('common.errorUpdatingProfile');
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">{t('common.loading')}</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-base font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {user?.firstName} {user?.lastName}
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white px-2.5 py-1.5 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm">
            {t('common.editProfile')}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-6 pb-32 md:pb-6">
        <div className="w-full  mx-auto">
            {error && (
              <div className="mb-2 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-2 py-2 rounded-lg">
                {error}
              </div>
            )}

            {isEditing ? (
              <>
              <form onSubmit={handleSubmit} className="space-y-3 mb-28 md:mb-0">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {t('profile.sections.personalInfo')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.firstName')}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.lastName')}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('profile.placeholders.phone')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.dateOfBirth')}
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {t('profile.sections.address')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="md:col-span-2 lg:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.address')}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t('profile.placeholders.address')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.city')}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t('profile.placeholders.city')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.fields.country')}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder={t('profile.placeholders.country')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

              </form>
              
              {/* Action Buttons - Fixed on Mobile */}
              <div className="fixed bottom-16 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-0 md:bg-transparent md:dark:bg-transparent md:border-t-0 md:pt-2 z-10 shadow-lg md:shadow-none">
                <div className="flex justify-end gap-2 max-w-6xl mx-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 md:flex-none px-4 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-900 dark:text-gray-100 text-sm"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 md:flex-none px-4 py-2.5 md:py-2 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium text-sm"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
              </>
            ) : (
              <div className="space-y-3">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {t('profile.sections.personalInfo')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex items-start gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.firstName')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.firstName || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.lastName')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.lastName || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.email')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.email || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.phone')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.phone || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.dateOfBirth')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.dateOfBirth 
                            ? new Date(user.dateOfBirth).toLocaleDateString('fr-FR') 
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {t('profile.sections.address')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex items-start gap-2 md:col-span-2 lg:col-span-2">
                      <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.address')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {user?.address || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.city')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.city || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('profile.fields.country')}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {user?.country || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;