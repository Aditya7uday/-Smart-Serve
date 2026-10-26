import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { Loader2, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ResetPassword() {
  const { uid, token } = useParams();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const validateField = (name, data) => {
    if (name === 'password') {
      if (!data.password) return 'Password is required';
      if (data.password.length < 6) return 'Password must be at least 6 characters';
    }
    if (name === 'confirmPassword') {
      if (!data.confirmPassword) return 'Please confirm your password';
      if (data.password !== data.confirmPassword) return "Passwords don't match";
    }
    return undefined;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, formData) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = {};
    ['password', 'confirmPassword'].forEach(name => {
      const err = validateField(name, formData);
      if (err) errs[name] = err;
    });
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await authService.confirmResetPassword({ uid, token, password: formData.password });
      setIsDone(true);
      addToast('Password reset successfully!', 'success');
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="w-12 h-12 bg-primary-orange rounded-xl mx-auto flex items-center justify-center text-white">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text">Set a new password</h2>
        </div>

        {isDone ? (
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> Your password has been reset. You can sign in now.
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-primary-orange hover:text-orange-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Go to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <FormInput
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  error={fieldErrors.password}
                  required
                />
                <FormInput
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  error={fieldErrors.confirmPassword}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary-gray hover:text-dark-text font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
