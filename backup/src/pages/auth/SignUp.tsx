import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/shared/Input';
import Notification from '@/components/shared/Notification';

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {showVerificationNotice && (
        <Notification
          type="info"
          message="Please check your email to verify your account. You'll need to verify your email before you can sign in."
          duration={10000}
          onClose={() => setShowVerificationNotice(false)}
        />
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-accent">AI CABY</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
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
            className={`
              w-full py-3 px-4 rounded-lg text-white font-medium
              ${isLoading
                ? 'bg-primary/50 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
              }
            `}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/signin" className="text-primary hover:text-primary/80 font-medium">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 