# API Integration Guide

## ✅ Implementation Complete - Using Axios

The application is now fully integrated with your backend API at `http://localhost:3000` using **Axios** for superior HTTP handling.

## 🔐 Authentication Flow

### Login Process
1. User enters email and password on `/login` page
2. Frontend sends POST request to `http://localhost:3000/auth/login`
3. Backend returns:
   ```json
   {
     "data": {
       "accessToken": "JWT_TOKEN",
       "user": {
         "id": "uuid",
         "email": "user@example.com",
         "firstName": "John",
         "lastName": "Doe"
       }
     },
     "isSuccess": true
   }
   ```
4. Frontend:
   - Stores `accessToken` in localStorage
   - Decodes JWT to extract role (ADMIN, AGENT, CLIENT)
   - Stores user data in localStorage and state
   - Redirects to appropriate dashboard based on role

### JWT Token Structure
The JWT token contains:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "ADMIN|AGENT|CLIENT",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization
All authenticated API requests include:
```
Authorization: Bearer {accessToken}
```

## 📝 Updated Files

### 1. `src/api/index.js`
- ✅ **Axios** implementation (better than fetch!)
- ✅ Request/Response interceptors
- ✅ Automatic token injection in headers
- ✅ Global error handling
- ✅ Automatic 401 redirect to login
- ✅ 10 second timeout
- ✅ JSON transformation automatically
- ✅ Full CRUD operations for users & bookings
- ✅ Configurable API_BASE_URL

### 2. `src/Context/AuthContext.jsx`
- ✅ Real API login integration
- ✅ JWT token decoding to extract role
- ✅ Token expiration validation
- ✅ Automatic role-based navigation
- ✅ User data persistence

### 3. `src/Pages/public/Login.jsx`
- ✅ Removed mock role selector
- ✅ Added loading state
- ✅ Better error messages
- ✅ Disabled button during login

### 4. `.env`
- ✅ Configurable API URL via environment variable

## 🧪 Testing

### Test with your credentials:
```
Email: user@example.com
Password: password123
```

The app will:
1. Call your backend API
2. Extract role from JWT (your example shows ADMIN)
3. Redirect to `/admin/dashboard`

## 🔧 Configuration

### Change API URL
Edit `.env` file:
```env
VITE_API_URL=http://your-api-domain.com
```

### Default User Object Structure
```javascript
{
  id: "ed966a42-9062-4dbd-a097-1a7b4f09d78d",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  role: "ADMIN" // Extracted from JWT
}
```

## 🔄 Token Refresh
Currently not implemented. To add token refresh:

1. Add refresh token endpoint to `src/api/index.js`:
```javascript
refreshToken: async (refreshToken) => {
  const response = await apiCall('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  return response.data;
}
```

2. Add token refresh logic in `AuthContext.jsx`

## 🚀 Why Axios?

Axios provides several advantages over fetch:
- ✅ Automatic JSON transformation
- ✅ Request/Response interceptors
- ✅ Better error handling
- ✅ Request timeout support
- ✅ Request cancellation
- ✅ CSRF protection
- ✅ Progress tracking
- ✅ Cleaner API

## 📚 API Methods Available

### Authentication
- `api.auth.login({ email, password })` - Login user
- `api.auth.register(userData)` - Register new user
- `api.auth.logout()` - Logout user (calls API + clears local storage)
- `api.auth.getCurrentUser()` - Get current authenticated user

### Users (Protected)
- `api.users.getAll()` - Get all users
- `api.users.getById(id)` - Get user by ID
- `api.users.create(userData)` - Create new user
- `api.users.update(id, userData)` - Update user
- `api.users.delete(id)` - Delete user

### Bookings (Protected)
- `api.bookings.getAll()` - Get all bookings
- `api.bookings.getById(id)` - Get booking by ID
- `api.bookings.create(bookingData)` - Create new booking
- `api.bookings.update(id, bookingData)` - Update booking
- `api.bookings.delete(id)` - Delete booking

## 📋 Next Steps

1. **Add more API endpoints** in `src/api/index.js`
2. **Implement token refresh** for better UX
3. **Add request interceptors** for global error handling
4. **Add loading states** throughout the app
5. **Implement React Query** for better data fetching and caching

## 🔒 Security Notes

- ✅ JWT tokens stored in localStorage
- ✅ Tokens sent via Authorization header
- ✅ Token expiration validation on app load
- ✅ Automatic logout on expired tokens
- ⚠️ Consider using httpOnly cookies for production (requires backend changes)

## 💡 Usage Example

```javascript
import { api } from './api';

// Login
try {
  const response = await api.auth.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('Logged in:', response);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get users (authenticated request)
try {
  const users = await api.users.getAll();
  console.log('Users:', users);
} catch (error) {
  console.error('Failed to fetch users:', error.message);
}
```

## ✅ Ready to Use!

Your app is now ready to authenticate against your real backend. Just start the dev server and test the login!

```bash
npm run dev
```
