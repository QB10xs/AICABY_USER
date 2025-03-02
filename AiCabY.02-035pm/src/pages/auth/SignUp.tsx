import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/shared/Input';
import BackButton from '@/components/shared/BackButton';
import Notification from '@/components/shared/Notification';
import { Car, ExternalLink } from 'lucide-react';

// Validation schema
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const { signUp, isLoading, error } = useAuthStore();
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data.email, data.password);
      setShowVerificationNotice(true);
      reset(); // Clear form
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 transition-colors">
      {showVerificationNotice && (
        <Notification
          type="info"
          message="Please check your email to verify your account. You'll need to verify your email before you can sign in."
          duration={10000}
          onClose={() => setShowVerificationNotice(false)}
        />
      )}

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg dark:shadow-zinc-900/50 border border-zinc-200 dark:border-zinc-700">
        {/* Back Button and Logo */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <BackButton />
            <div className="bg-primary p-2 rounded-xl inline-flex">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-center">Get Started!</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-center">Create your account to begin.</p>
          
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
          <div className="bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 p-4 rounded-lg text-sm">
            {error}
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

          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary hover:text-primary/90 hover:underline transition-colors">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
          By signing up, you agree to our{' '}
          <Link to="/driver/docs?tab=mediation" className="text-primary hover:text-primary/90 hover:underline transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/driver/docs?tab=guidelines" className="text-primary hover:text-primary/90 hover:underline transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 