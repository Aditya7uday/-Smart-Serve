import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { authService } from '../../services/authService';
import { FormInput } from '../../components/FormInput';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  
  const { addToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.resetPassword(email);
      setIsSent(true);
      addToast('Password reset link sent to your email!', 'success');
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
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-primary-orange hover:text-orange-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            <FormInput
              label="Email address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
