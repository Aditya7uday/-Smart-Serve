import { users } from '../data/mockData';

// Simulated delay to mimic network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay(800); // Simulate network request
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Do not return password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  register: async (userData) => {
    await delay(1000);
    
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }
    
    // In a real app we'd send to backend. Here we just pretend it worked.
    const newUser = {
      id: `u${Date.now()}`,
      ...userData
    };
    
    // Temporarily mutate mock data for demo purposes in this session
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  resetPassword: async (email) => {
    await delay(1000);
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('No account found with this email');
    }
    return { success: true, message: 'Password reset instructions sent to your email.' };
  }
};
