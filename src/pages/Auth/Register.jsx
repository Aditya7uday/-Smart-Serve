import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { Loader2, UserPlus } from 'lucide-react';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { dispatch } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const user = await authService.register(registerData);
      
      dispatch({ type: 'LOGIN', payload: user });
      addToast(`Account created successfully! Welcome, ${user.name}!`, 'success');
      
      const redirectPath = user.role === 'delivery' ? '/delivery/dashboard' : '/customer/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to register');
      addToast(err.message || 'Failed to register', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.password.trim() !== '' && 
    formData.confirmPassword.trim() !== '';

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="w-12 h-12 bg-primary-orange rounded-xl mx-auto flex items-center justify-center text-white">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text">Create an account</h2>
          <p className="mt-2 text-center text-sm text-secondary-gray">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-orange hover:text-orange-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <FormInput
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-colors ${formData.role === 'customer' ? 'border-primary-orange bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${formData.role === 'customer' ? 'text-primary-orange' : 'text-dark-text'}`}>
                    Customer (Student/Staff)
                  </span>
                </label>
                <label className={`border rounded-lg p-3 flex items-center cursor-pointer transition-colors ${formData.role === 'delivery' ? 'border-primary-orange bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="delivery"
                    checked={formData.role === 'delivery'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${formData.role === 'delivery' ? 'text-primary-orange' : 'text-dark-text'}`}>
                    Delivery Staff
                  </span>
                </label>
              </div>
              <p className="mt-2 text-xs text-secondary-gray">Admin registration is disabled. Use the demo account to access admin features.</p>
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
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
