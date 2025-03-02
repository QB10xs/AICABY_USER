import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              first_name: firstName,
              email: email,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      toast.error(error.message || 'Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-[rgba(255,255,255,0.05)] rounded-2xl border border-[#F7C948]/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-[#F7C948] hover:text-[#F7C948]/80"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#F7C948]/20 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-[#F7C948]/50 focus:border-[#F7C948]/50 focus:z-10 sm:text-sm bg-[rgba(255,255,255,0.05)]"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#F7C948]/20 placeholder-gray-500 text-white focus:outline-none focus:ring-[#F7C948]/50 focus:border-[#F7C948]/50 focus:z-10 sm:text-sm bg-[rgba(255,255,255,0.05)]"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#F7C948]/20 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-[#F7C948]/50 focus:border-[#F7C948]/50 focus:z-10 sm:text-sm bg-[rgba(255,255,255,0.05)]"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#F7C948] hover:bg-[#F7C948]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F7C948]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 