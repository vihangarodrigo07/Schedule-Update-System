// Save user data to localStorage
export const saveUserData = (userData) => {
  if (userData.token) {
    localStorage.setItem('token', userData.token);
  }
  localStorage.setItem('user_id', userData.user_id);
  localStorage.setItem('full_name', userData.full_name);
  localStorage.setItem('user_type', userData.user_type);
};

// Clear user data from localStorage
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('full_name');
  localStorage.removeItem('user_type');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('user_id');
};

// Get current user ID
export const getCurrentUserId = () => {
  return localStorage.getItem('user_id');
};

// Get current user name
export const getCurrentUserName = () => {
  return localStorage.getItem('full_name');
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem('user_type');
};