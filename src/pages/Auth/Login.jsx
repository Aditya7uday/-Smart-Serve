import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { Loader2, KeyRound } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { dispatch } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'LOGIN', payload: user });
      addToast(`Welcome back, ${user.name}!`, 'success');
      
      // Redirect based on role or to where they tried to go
      if (location.state?.from) {
        navigate(from, { replace: true });
      } else {
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                             user.role === 'delivery' ? '/delivery/dashboard' : '/customer/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      addToast(err.message || 'Failed to login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Customer', email: 'customer@smartserve.demo' },
    { label: 'Admin', email: 'admin@smartserve.demo' },
    { label: 'Delivery', email: 'delivery@smartserve.demo' }
  ];

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="w-12 h-12 bg-primary-orange rounded-xl mx-auto flex items-center justify-center text-white">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-secondary-gray">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-orange hover:text-orange-600 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <FormInput
              label="Email address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <FormInput
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-orange hover:text-orange-600">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-center font-medium text-secondary-gray mb-4">Demo Accounts (Click to fill)</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.label}
                onClick={() => handleDemoLogin(acc.email)}
                type="button"
                className="px-2 py-2 text-xs font-medium text-dark-text bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
