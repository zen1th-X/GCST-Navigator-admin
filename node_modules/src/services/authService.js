/**
 * Authentication Service
 * 
 * This module provides API stubs for authentication operations.
 * Currently returns simulated responses for front-end development.
 * 
 * FUTURE INTEGRATION:
 * Replace the simulated responses with actual API calls to your backend.
 * Example: fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
 */

/**
 * Simulates a login API call.
 * @param {string} email - The user's email or username
 * @param {string} password - The user's password
 * @param {boolean} remember - Whether to remember the session
 * @returns {Promise<Object>} - Simulated API response
 */
export const login = async (email, password, remember = false) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // ----- REPLACE THIS BLOCK WITH REAL API CALL -----
  // Example real implementation:
  //
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
  //   },
  //   body: JSON.stringify({ email, password, remember }),
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Login failed');
  // }
  //
  // return response.json();
  // --------------------------------------------------

  // Simulated response for development
  console.log('[AuthService] Login attempt:', { email, remember });

  return {
    success: true,
    message: 'Login simulation successful. Connect a backend to enable real authentication.',
    user: {
      id: null,
      email: email,
      role: 'admin',
    },
    token: null,
  };
};

/**
 * Simulates a logout API call.
 * @returns {Promise<Object>}
 */
export const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // FUTURE: await fetch('/api/auth/logout', { method: 'POST' });

  return { success: true, message: 'Logged out' };
};

/**
 * Simulates a forgot password API call.
 * @param {string} email
 * @returns {Promise<Object>}
 */
export const forgotPassword = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // FUTURE: await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });

  console.log('[AuthService] Password reset requested for:', email);
  return { success: true, message: 'Password reset link sent (simulated).' };
};
