// Example: How to use the Axios-based API

import { api, axiosClient } from '../api';

// ============================================
// 1. AUTHENTICATION EXAMPLES
// ============================================

// Login
async function loginExample() {
  try {
    const response = await api.auth.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response);
    // Token is automatically stored in localStorage
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Logout
async function logoutExample() {
  try {
    await api.auth.logout();
    console.log('Logged out successfully');
    // Automatically cleared localStorage and called API
  } catch (error) {
    console.error('Logout error:', error.message);
  }
}

// Get current user
async function getCurrentUserExample() {
  try {
    const user = await api.auth.getCurrentUser();
    console.log('Current user:', user);
  } catch (error) {
    console.error('Failed to get user:', error.message);
  }
}

// ============================================
// 2. USER MANAGEMENT EXAMPLES
// ============================================

// Get all users
async function getAllUsersExample() {
  try {
    const users = await api.users.getAll();
    console.log('All users:', users);
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
  }
}

// Get user by ID
async function getUserByIdExample() {
  try {
    const user = await api.users.getById('user-id-here');
    console.log('User:', user);
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
  }
}

// Create new user
async function createUserExample() {
  try {
    const newUser = await api.users.create({
      email: 'newuser@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'securepassword',
      role: 'CLIENT'
    });
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Failed to create user:', error.message);
  }
}

// Update user
async function updateUserExample() {
  try {
    const updatedUser = await api.users.update('user-id-here', {
      firstName: 'Jane',
      lastName: 'Doe'
    });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error.message);
  }
}

// Delete user
async function deleteUserExample() {
  try {
    await api.users.delete('user-id-here');
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error.message);
  }
}

// ============================================
// 3. BOOKING MANAGEMENT EXAMPLES
// ============================================

// Get all bookings
async function getAllBookingsExample() {
  try {
    const bookings = await api.bookings.getAll();
    console.log('All bookings:', bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error.message);
  }
}

// Create booking
async function createBookingExample() {
  try {
    const booking = await api.bookings.create({
      destination: 'Paris, France',
      startDate: '2025-12-01',
      endDate: '2025-12-10',
      travelers: 2,
      notes: 'Honeymoon trip'
    });
    console.log('Booking created:', booking);
  } catch (error) {
    console.error('Failed to create booking:', error.message);
  }
}

// Update booking
async function updateBookingExample() {
  try {
    const updated = await api.bookings.update('booking-id-here', {
      status: 'confirmed'
    });
    console.log('Booking updated:', updated);
  } catch (error) {
    console.error('Failed to update booking:', error.message);
  }
}

// ============================================
// 4. CUSTOM REQUESTS (Advanced)
// ============================================

// Use axiosClient directly for custom endpoints
async function customRequestExample() {
  try {
    // GET request
    const response = await axiosClient.get('/custom/endpoint');
    console.log('Custom response:', response);

    // POST with custom headers
    const postResponse = await axiosClient.post(
      '/custom/endpoint',
      { data: 'value' },
      {
        headers: {
          'Custom-Header': 'value'
        }
      }
    );
    console.log('Custom POST:', postResponse);

    // Request with query parameters
    const searchResponse = await axiosClient.get('/search', {
      params: {
        query: 'paris',
        limit: 10
      }
    });
    console.log('Search results:', searchResponse);
  } catch (error) {
    console.error('Custom request failed:', error.message);
  }
}

// ============================================
// 5. ERROR HANDLING PATTERNS
// ============================================

// Proper error handling with try-catch
async function errorHandlingExample() {
  try {
    const user = await api.users.getById('invalid-id');
  } catch (error) {
    if (error.message.includes('404')) {
      console.error('User not found');
    } else if (error.message.includes('401')) {
      console.error('Unauthorized - please login');
    } else if (error.message.includes('connection')) {
      console.error('Network error - check your internet');
    } else {
      console.error('Unknown error:', error.message);
    }
  }
}

// With loading state in React
function useApiExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.users.getAll();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}

// ============================================
// 6. INTERCEPTOR BENEFITS
// ============================================

// All these happen automatically:
// - Authorization header added to every request
// - JSON response automatically parsed
// - 401 errors redirect to /login
// - Network errors show friendly messages
// - Request timeout after 10 seconds

export {
  loginExample,
  getAllUsersExample,
  createBookingExample,
  customRequestExample,
  errorHandlingExample
};
