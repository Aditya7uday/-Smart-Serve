import { createContext, useReducer, useContext } from 'react';
import { tokenStore } from '../services/apiClient';

const AuthContext = createContext();

const USER_KEY = 'smartserve_user';

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    return user && tokenStore.get()?.access ? user : null;
  } catch {
    return null;
  }
}

const storedUser = loadStoredUser();

const initialState = {
  user: storedUser, // { id, name, role: 'customer' | 'admin' | 'delivery' }
  isAuthenticated: !!storedUser,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem(USER_KEY);
      tokenStore.clear();
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
