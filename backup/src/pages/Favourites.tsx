import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { searchLocation } from '@/services/mapService';
import { Location } from '@/types/map';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'favorite';
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}



// Demo data for saved locations
const demoLocations: SavedLocation[] = [
  {
    id: 'loc-001',
    name: 'Home',
    address: 'Prinsengracht 263-267, Amsterdam',
    type: 'home'
  },
  {
    id: 'loc-002',
    name: 'Office',
    address: 'Gustav Mahlerplein 50, Amsterdam',
    type: 'work'
  },
  {
    id: 'loc-003',
    name: 'Gym',
    address: 'Weteringschans 85, Amsterdam',
    type: 'favorite'
  }
];

// Demo data for emergency contacts
const demoContacts: EmergencyContact[] = [
  {
    id: 'contact-001',
    name: 'Emma van der Berg',
    phone: '+31 6 1234 5678',
    relationship: 'Partner'
  },
  {
    id: 'contact-002',
    name: 'Jan de Vries',
    phone: '+31 6 8765 4321',
    relationship: 'Family'
  },
  {
    id: 'contact-003',
    name: 'Sophie Bakker',
    phone: '+31 6 9876 5432',
    relationship: 'Emergency Contact'
  }
];

const Favourites: React.FC = () => {
  const { user } = useAuthStore();
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(demoLocations);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(demoContacts);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);


  const { register: registerLocation, handleSubmit: handleLocationSubmit, reset: resetLocation } = useForm({
    defaultValues: {
      name: '',
      type: 'favorite' as const,
    },
  });

  const { register: registerContact, handleSubmit: handleContactSubmit, reset: resetContact } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  useEffect(() => {
    fetchSavedLocations();
    fetchEmergencyContacts();
  }, [user]);

  const fetchSavedLocations = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', user.id);
    
    if (data && !error) {
      setSavedLocations(data);
    }
  };

  const fetchEmergencyContacts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id);
    
    if (data && !error) {
      setEmergencyContacts(data);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      const results = await searchLocation(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddLocation = async (data: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('saved_locations')
      .insert([{
        user_id: user.id,
        ...data
      }]);
    
    if (!error) {
      fetchSavedLocations();
      setIsAddingLocation(false);
      resetLocation();
    }
  };

  const handleAddContact = async (data: any) => {
    if (!user) return;
    const { error } = await supabase
      .from('emergency_contacts')
      .insert([{
        user_id: user.id,
        ...data
      }]);
    
    if (!error) {
      fetchEmergencyContacts();
      setIsAddingContact(false);
      resetContact();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-accent/5 to-primary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
          >
            <h1 className="text-3xl font-bold text-gray-900">My Favourites</h1>
            <p className="text-gray-600 mt-2">Manage your favourite locations and emergency contacts</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Saved Locations</h3>
              <p className="text-3xl font-bold text-accent mt-2">{savedLocations.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
              <p className="text-3xl font-bold text-accent mt-2">{emergencyContacts.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
              <p className="text-3xl font-bold text-accent mt-2">24/7</p>
            </motion.div>
          </div>

          {/* Saved Locations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Saved Locations</h2>
              <button
                onClick={() => setIsAddingLocation(true)}
                className="bg-accent text-white hover:bg-accent/90 px-4 py-2 rounded-lg transition-colors"
              >
                Add Location
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
                >
                  <div className="text-4xl mb-3">{location.name === 'Home' ? '🏠' : location.name === 'Office' ? '🏢' : '💪'}</div>
                  <div className="text-4xl mb-3">{location.type === 'home' ? '🏠' : location.type === 'work' ? '💼' : '⭐'}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{location.address}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="bg-primary text-accent hover:bg-primary/90 px-4 py-2 rounded-lg text-sm transition-colors">
                      Set as destination
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Location Form */}
            {isAddingLocation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New Location</h3>
                  <form onSubmit={handleLocationSubmit(handleAddLocation)} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Search address..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                      {searchResults.length > 0 && (
                        <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                          {searchResults.map((result) => (
                            <div
                              key={result.coordinates.join(',')}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSearchResults([]);
                              }}
                            >
                              {result.address}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      {...registerLocation('name')}
                      placeholder="Label (e.g., Home, Office)"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setIsAddingLocation(false)}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-accent hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
                      >
                        Save Location
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>

          {/* Emergency Contacts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Emergency Contacts</h2>
              <button
                onClick={() => setIsAddingContact(true)}
                className="bg-accent text-white hover:bg-accent/90 px-4 py-2 rounded-lg transition-colors"
              >
                Add Contact
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-primary">{contact.relationship}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{contact.phone}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <button 
                      className="bg-primary text-accent hover:bg-primary/90 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Call Now
                    </button>
                    <button 
                      className="bg-accent text-white hover:bg-accent/90 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Share Location
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Contact Form */}
            {isAddingContact && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add Emergency Contact</h3>
                  <form onSubmit={handleContactSubmit(handleAddContact)} className="space-y-4">
                    <input
                      {...registerContact('name')}
                      placeholder="Contact Name"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      {...registerContact('phone')}
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      {...registerContact('relationship')}
                      placeholder="Relationship"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setIsAddingContact(false)}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-accent hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
                      >
                        Save Contact
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Favourites; 