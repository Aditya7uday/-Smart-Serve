import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { isValidEmail } from '../../utils/validators';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const { addToast } = useToast();

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    if (!isValidEmail(value)) return 'Enter a valid email address';
    return '';
  };

  const handleBlur = () => setFieldError(validateEmail(email));

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    const err = validateEmail(email);
    if (err) { setFieldError(err); return; }
    setFieldError('');
    setIsLoading(true);

    try {
      const result = await authService.resetPassword(email);
      setResetLink(`${window.location.origin}/reset-password/${result.uid}/${result.token}`);
      setIsSent(true);
      addToast('Password reset link generated!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
      addToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="w-12 h-12 bg-primary-orange/10 rounded-xl mx-auto flex items-center justify-center text-primary-orange">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text">Reset Password</h2>
          <p className="mt-2 text-center text-sm text-secondary-gray">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isSent ? (
          <div className="text-center space-y-6">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-left">
              <p className="font-semibold mb-1">⚠️ No email service is set up for this project.</p>
              <p className="text-sm mb-3">In a real deployment this link would be emailed to <strong>{email}</strong>. For now, here it is directly:</p>
              <Link to={resetLink.replace(window.location.origin, '')} className="block w-full text-center text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg px-3 py-2 break-all transition-colors">
                Reset my password →
              </Link>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-primary-orange hover:text-orange-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset} noValidate>
            <FormInput
              label="Email address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
              onBlur={handleBlur}
              placeholder="you@example.com"
              error={fieldError}
              required
            />

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-secondary-gray hover:text-dark-text font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
