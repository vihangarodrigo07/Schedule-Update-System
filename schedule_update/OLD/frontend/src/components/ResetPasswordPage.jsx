import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) return toast.error('Enter a new password');

    setLoading(true);

    const { error } = await supabase.auth.updateUser(
      { password }, 
      accessToken
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset successful!');
      navigate('/login');
    }

    setLoading(false);
  };

  if (!accessToken) {
    return <p className="text-center mt-20">Invalid or expired reset link.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleReset} className="card p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
