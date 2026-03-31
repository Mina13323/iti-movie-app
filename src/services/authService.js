/**
 * Simulated Authentication Service
 * Mimics real API behavior using LocalStorage as the database.
 */

const USERS_KEY = "netmovies_users";
const AUTH_KEY = "netmovies_auth_user";

const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error("User already exists with this email.");
    }

    const { confirmPassword, ...newUser } = userData;
    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    return { success: true, user: newUser };
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  },

  /**
   * Logout user
   */
  logout: async () => {
    await delay(300);
    localStorage.removeItem(AUTH_KEY);
    return { success: true };
  },

  /**
   * Get current authenticated user from storage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  }
};
