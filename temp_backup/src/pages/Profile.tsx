import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabaseClient';
import Layout from '@/components/layout/Layout';
import Input from '@/components/shared/Input';
import Notification from '@/components/shared/Notification';

interface UserProfile {
  id: string;
  first_name: string;
  phone_number: string;
  email: string;
  avatar_url?: string;
  payment_preferences?: string[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Cash',
    icon: '💶',
    description: 'Pay with cash directly to driver'
  },
  {
    id: 'tikkie',
    name: 'Tikkie',
    icon: '📱',
    description: 'Pay via Tikkie payment request'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💳',
    description: 'Pay with card via POS terminal'
  }
];

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        email: user.email || '',
      });
      setSelectedPayments(data.payment_preferences || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('error', 'Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          phone_number: profile.phone_number,
          payment_preferences: selectedPayments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      showNotification('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'File must be JPG, PNG or GIF');
      return;
    }

    try {
      setIsLoading(true);
      
      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }
      
      // Upload new image to Supabase Storage
      const fileExt = file.type.split('/')[1];
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      showNotification('success', 'Profile photo updated successfully');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      showNotification('error', error.message || 'Failed to upload photo');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaymentMethod = (methodId: string) => {
    setSelectedPayments(prev => 
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center text-2xl font-bold shadow-md">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      className="px-4 py-2 bg-primary text-accent rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Upload Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <Input
                  label="Name"
                  name="first_name"
                  value={profile?.first_name || ''}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />

                <Input
                  label="Email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-50"
                />

                <Input
                  label="Phone Number"
                  name="phone_number"
                  value={profile?.phone_number || ''}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />

                {/* Payment Preferences Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Payment Preferences</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Select multiple</span>
                      <div className="relative group">
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Information about payment methods"
                        >
                          <span className="text-gray-600">ℹ</span>
                        </button>
                        <div className="absolute right-0 w-64 p-3 bg-white border border-gray-200 shadow-lg text-gray-600 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 mt-2">
                          Select your preferred payment methods. You can choose multiple options.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => togglePaymentMethod(method.id)}
                        className={`
                          relative p-4 rounded-xl transition-all duration-200 text-left
                          ${selectedPayments.includes(method.id)
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                          </div>
                        </div>
                        {selectedPayments.includes(method.id) && (
                          <div className="absolute top-2 right-2">
                            <span className="text-primary">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      px-6 py-2 rounded-lg text-white font-medium
                      ${isLoading
                        ? 'bg-primary/50 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90'
                      }
                    `}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-500">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h2>
              <p className="text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </Layout>
  );
};

export default Profile; 