import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ManualForm from '@/components/booking/ManualForm';
import AIChat from '@/components/booking/AIChat';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [bookingMode, setBookingMode] = useState<'manual' | 'ai'>('ai');
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello, {firstName}</h1>
          <p className="text-gray-600 mt-2">Chat with our AI assistant to book your ride or switch to manual booking</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setBookingMode('ai')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              bookingMode === 'ai'
                ? 'bg-primary text-accent font-semibold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            AI Booking
          </button>
          <button
            onClick={() => setBookingMode('manual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              bookingMode === 'manual'
                ? 'bg-primary text-accent font-semibold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manual Booking
          </button>
        </div>

        <div className={`
          bg-white rounded-lg shadow-md overflow-hidden
          ${bookingMode === 'ai' ? 'h-[600px]' : ''}
        `}>
          {bookingMode === 'manual' ? (
            <div className="p-6">
              <ManualForm />
            </div>
          ) : (
            <AIChat />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 