import { createContext, useReducer, useContext, useEffect } from 'react';
import { tokenStore } from '../services/apiClient';
import { authService } from '../services/authService';

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

  // The cached user (localStorage) can go stale, e.g. a phone number saved on
  // another device/session. Refresh from the DB once on load.
  useEffect(() => {
    if (!state.isAuthenticated) return;
    authService.me()
      .then(user => dispatch({ type: 'LOGIN', payload: user }))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
