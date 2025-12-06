import { useEffect, useState } from 'react';
import { api } from '../../api';
import type { User } from '../../types';
// import { User } from '../../types/auth-models';

const ClientProfile = () => {
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
          phone: response.data.customer.phone || '',
          address: response.data.customer.address || '',
          city: response.data.city || '',
          country: response.data.country || '',
          dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : ''
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement du profil');
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
      setError('Erreur: ID utilisateur introuvable');
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
        // Afficher un message de succès
        alert('Profil mis à jour avec succès!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Modifier le profil
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Profile Header - Fixed */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.isActive ? 'Actif' : 'Inactif'}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Grid Layout for Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Informations Personnelles */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200">
                    Informations Personnelles
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-0.5">L'email ne peut pas être modifié</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200">Adresse</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Rue Principale"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Paris"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pays</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="France"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadUserProfile();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Informations Personnelles */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Prénom</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.firstName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Nom</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.lastName || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500">Email</label>
                    <p className="mt-0.5 text-sm text-gray-900 break-all">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Téléphone</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.customer?.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Date de Naissance</label>
                    <p className="mt-0.5 text-sm text-gray-900">
                      {user?.customer?.dateOfBirth ? new Date(user?.customer?.dateOfBirth).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200">Adresse</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500">Adresse</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.customer?.address || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Ville</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.customer?.city || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Pays</label>
                    <p className="mt-0.5 text-sm text-gray-900">{user?.customer?.country || '-'}</p>
                  </div>
                </div>

                {/* Informations du compte */}
                <div className="pt-3">
                  <h3 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-3">
                    Informations du compte
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Rôle</label>
                      <p className="mt-0.5 text-sm text-gray-900">{user?.role || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Langue</label>
                      <p className="mt-0.5 text-sm text-gray-900">{user?.languageId || '-'}</p>
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

export default ClientProfile;
