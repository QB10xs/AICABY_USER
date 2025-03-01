import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/shared/Input';
import BackButton from '../../components/shared/BackButton';
import { Car, ExternalLink } from 'lucide-react';

// Validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isLoading, error: authError } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  React.useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg dark:shadow-zinc-900/50 border border-zinc-200 dark:border-zinc-700">
        {/* Back Button and Logo */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <BackButton />
            <div className="bg-primary p-2 rounded-xl inline-flex">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-center">Welcome Back!</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-center">Sign in to continue your journey.</p>
          
          {/* Additional Links */}
          <div className="mt-4 flex flex-col items-center space-y-3">
            <Link 
              to="/about" 
              className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Learn more about AI CABY
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                id="remember-me"
                className="h-4 w-4 text-primary focus:ring-primary/20 border-zinc-300 dark:border-zinc-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-600 dark:text-zinc-400">
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-black rounded-lg transition-all duration-200 ${isLoading 
              ? 'bg-primary/70 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 hover:shadow-lg'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary/90 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn; 