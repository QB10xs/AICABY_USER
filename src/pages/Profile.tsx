import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
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
  created_at: string;
  total_rides: number;
  total_distance: number;
  favorite_locations?: string[];
  badge_level?: 'gold' | 'silver' | 'bronze' | 'new';
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

const getBadgeLevel = (totalRides: number): 'gold' | 'silver' | 'bronze' | 'new' => {
  if (totalRides >= 500) return 'gold';
  if (totalRides >= 200) return 'silver';
  if (totalRides >= 50) return 'bronze';
  return 'new';
};

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
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch ride history
      const { data: rideData, error: rideError } = await supabase
        .from('rides')
        .select('id, distance, created_at, status')
        .eq('user_id', user.id);

      if (rideError) throw rideError;

      // Calculate total rides and distance
      const completedRides = rideData?.filter(ride => ride.status === 'completed') || [];
      const totalRides = completedRides.length;
      const totalDistance = completedRides.reduce((acc, ride) => acc + (ride.distance || 0), 0);

      const profile = {
        ...profileData,
        email: user.email || '',
        total_rides: totalRides,
        total_distance: totalDistance,
        badge_level: getBadgeLevel(totalRides)
      };

      setProfile(profile);
      setSelectedPayments(profileData.payment_preferences || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
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

  const getNextLevelThreshold = (currentLevel: string) => {
    switch (currentLevel) {
      case 'new': return 50;
      case 'bronze': return 200;
      case 'silver': return 500;
      default: return 500;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-zinc-800/50 rounded-xl"></div>
              <div className="h-96 bg-zinc-800/50 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && profile && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* User Stats Section */}
            <div className="bg-zinc-900/90 rounded-xl p-6 border border-[#F7C948]/10">
              <h2 className="text-xl font-semibold mb-6 text-white">Ride Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#F7C948] mb-2">{profile.total_rides}</span>
                  <span className="text-sm text-zinc-400">Total Rides</span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#F7C948] mb-2">
                    {(profile.total_distance / 1000).toFixed(1)}km
                  </span>
                  <span className="text-sm text-zinc-400">Total Distance</span>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2">
                    {profile.badge_level === 'gold' ? '🏆' : 
                     profile.badge_level === 'silver' ? '🥈' : 
                     profile.badge_level === 'bronze' ? '🥉' : '🌟'}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {profile.badge_level ? `${profile.badge_level.charAt(0).toUpperCase()}${profile.badge_level.slice(1)} Member` : 'Member'}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Progress to next level</span>
                  <span className="text-sm text-[#F7C948]">
                    {profile.total_rides} / {getNextLevelThreshold(profile.badge_level || 'new')} rides
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#F7C948] rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (profile.total_rides / getNextLevelThreshold(profile.badge_level || 'new')) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Settings Section */}
            <div className="bg-zinc-900/90 rounded-xl border border-[#F7C948]/10 overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-semibold text-white mb-6">Profile Settings</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-[#F7C948]/20 text-[#F7C948] flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 hover:border-[#F7C948]/40">
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isLoading ? 
                          'bg-[#F7C948]/50 cursor-not-allowed' : 
                          'bg-[#F7C948] hover:bg-[#F7C948]/90'} text-zinc-900`}
                        disabled={isLoading}
                      >
                        <span className="flex items-center gap-2">
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Photo'
                          )}
                        </span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
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
                      <h2 className="text-lg font-semibold text-white">Payment Preferences</h2>
                      <div className="flex items-center">
                        <span className="text-sm text-zinc-400 mr-2">Select multiple</span>
                        <div className="relative group">
                          <button
                            type="button"
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors border border-[#F7C948]/20"
                            aria-label="Information about payment methods"
                          >
                            <span className="text-[#F7C948]">ℹ</span>
                          </button>
                          <div className="absolute right-0 w-64 p-3 bg-zinc-800 border border-[#F7C948]/20 shadow-xl text-zinc-300 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 mt-2 backdrop-blur-sm">
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
                            relative p-4 rounded-xl transition-all duration-300 text-left
                            ${selectedPayments.includes(method.id)
                              ? 'bg-[#F7C948]/10 border border-[#F7C948]'
                              : 'bg-zinc-800/50 border border-[#F7C948]/20 hover:border-[#F7C948]/40'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <h3 className="font-medium text-white">{method.name}</h3>
                              <p className="text-xs text-zinc-400 mt-1">{method.description}</p>
                            </div>
                          </div>
                          {selectedPayments.includes(method.id) && (
                            <div className="absolute top-2 right-2">
                              <span className="text-[#F7C948]">✓</span>
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
                        w-full py-3 rounded-lg font-medium transition-all duration-300
                        ${isLoading
                          ? 'bg-[#F7C948]/50 cursor-not-allowed'
                          : 'bg-[#F7C948] hover:bg-[#F7C948]/90'
                        } text-zinc-900
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl overflow-hidden border border-red-500/20">
              <div className="p-6">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;