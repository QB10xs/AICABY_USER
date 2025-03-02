import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar: string;
  carDetails: {
    model: string;
    color: string;
    plate: string;
  };
}

interface ActiveRide {
  id: string;
  status: 'upcoming' | 'ongoing' | 'scheduled';
  pickup: string;
  dropoff: string;
  date: Date;
  price: number;
  distance: number;
  duration: number;
  driver?: Driver;
  paymentMethod: string;
  notes?: string;
  eta?: number; // in minutes
}

// Demo data
const demoRides: ActiveRide[] = [
  {
    id: 'RIDE-001',
    status: 'ongoing',
    pickup: 'Amsterdam Central Station',
    dropoff: 'Schiphol Airport',
    date: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes from now
    price: 45.50,
    distance: 15.7,
    duration: 25,
    eta: 12,
    driver: {
      id: 'D1',
      name: 'Michael B.',
      phone: '+31 6 1234 5678',
      rating: 4.9,
      avatar: '👨🏻‍✦',
      carDetails: {
        model: 'Tesla Model Y',
        color: 'Midnight Silver',
        plate: 'TX-123-AB'
      }
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 'RIDE-002',
    status: 'upcoming',
    pickup: 'Rotterdam Business Center',
    dropoff: 'Rotterdam Central',
    date: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes from now
    price: 22.75,
    distance: 3.2,
    duration: 12,
    eta: 8,
    driver: {
      id: 'D2',
      name: 'Sarah K.',
      phone: '+31 6 8765 4321',
      rating: 4.8,
      avatar: '👩🏼‍✦',
      carDetails: {
        model: 'BMW i4',
        color: 'Alpine White',
        plate: 'EV-456-CD'
      }
    },
    paymentMethod: 'PayPal'
  },
  {
    id: 'RIDE-003',
    status: 'scheduled',
    pickup: 'The Hague Beach',
    dropoff: 'City Center',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    price: 18.90,
    distance: 4.5,
    duration: 15,
    paymentMethod: 'Apple Pay',
    notes: 'Please pick up at the main entrance'
  }
];

const ActiveRides: React.FC = () => {
  const [rides] = useState<ActiveRide[]>(demoRides);
  const [selectedRide, setSelectedRide] = useState<ActiveRide | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const getStatusColor = (status: ActiveRide['status']) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'scheduled':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessage = (ride: ActiveRide) => {
    setSelectedRide(ride);
    setIsMessageModalOpen(true);
  };

  const handleCancel = (ride: ActiveRide) => {
    // Implement cancellation logic
    console.log('Cancelling ride:', ride.id);
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
            <h1 className="text-3xl font-bold text-gray-900">Active Rides</h1>
            <p className="text-gray-600 mt-2">Manage your ongoing and upcoming rides</p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Ongoing Rides</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {rides.filter(r => r.status === 'ongoing').length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Rides</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {rides.filter(r => r.status === 'upcoming').length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Rides</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {rides.filter(r => r.status === 'scheduled').length}
              </p>
            </motion.div>
          </div>

          {/* Rides List */}
          <div className="space-y-6">
            {rides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                  <p className="text-2xl font-bold text-accent">€{ride.price.toFixed(2)}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ride Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">A</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pickup</p>
                          <p className="font-medium">{ride.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600">B</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dropoff</p>
                          <p className="font-medium">{ride.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{ride.distance} km</span>
                      <span>•</span>
                      <span>{ride.duration} min</span>
                      <span>•</span>
                      <span>{format(ride.date, 'HH:mm')}</span>
                    </div>

                    {ride.eta && (
                      <div className="bg-accent/5 rounded-lg p-3">
                        <p className="text-accent font-medium">
                          ETA: {ride.eta} minutes
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Driver Details & Actions */}
                  {ride.driver ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
                          {ride.driver.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold">{ride.driver.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-400">★</span>
                            <span>{ride.driver.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {ride.driver.carDetails.model} • {ride.driver.carDetails.plate}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => ride.driver && handleCall(ride.driver.phone)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Call Driver
                        </button>
                        <button
                          onClick={() => handleMessage(ride)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-gray-500">Driver will be assigned soon</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{ride.paymentMethod}</span>
                    {ride.notes && (
                      <span className="text-sm text-gray-600">• {ride.notes}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel(ride)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel Ride
                    </button>
                    <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                      Track Ride
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Modal */}
        {isMessageModalOpen && selectedRide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Message Driver</h3>
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Type your message here..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 bg-primary text-accent rounded-lg hover:bg-primary/90"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActiveRides; 