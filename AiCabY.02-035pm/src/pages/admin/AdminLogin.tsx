import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface MFAFactor {
  id: string;
  type: 'totp';
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
  friendly_name?: string;
}

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFactor, setCurrentFactor] = useState<MFAFactor | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        await setupMFA();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (token: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: currentFactor?.id ?? ''
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        code: token,
        factorId: currentFactor?.id ?? '',
        challengeId: data.id
      });

      if (verifyError) {
        toast.error(verifyError.message);
        return;
      }

      if (verifyData) {
        toast.success('Successfully logged in');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error during MFA verification:', error);
      toast.error('Invalid verification code');
    }
  };

  const setupMFA = async () => {
    try {
      const { data, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (factorsError) {
        toast.error(factorsError.message);
        return;
      }

      if (!data?.totp.length) {
        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp'
        });

        if (enrollError) {
          toast.error(enrollError.message);
          return;
        }

        if (enrollData) {
          toast.success('Please scan the QR code to set up 2FA');
          setCurrentFactor({
            id: enrollData.id,
            type: 'totp',
            totp: enrollData.totp,
            friendly_name: enrollData.friendly_name
          });
        }
      } else {
        const factor = data.totp[0];
        setCurrentFactor({
          id: factor.id,
          type: 'totp',
          totp: {
            qr_code: '',
            secret: '',
            uri: ''
          },
          friendly_name: factor.friendly_name
        });
      }
      setShowOTPInput(true);
    } catch (error) {
      console.error('Error setting up MFA:', error);
      toast.error('Failed to setup MFA');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
        </div>
        {!showOTPInput ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Loading...' : 'Sign in'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            handleMFAVerification(otpCode);
          }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 2FA code"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify 2FA'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin; 