import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

interface RideHistory {
  id: string;
  date: Date;
  pickup: string;
  dropoff: string;
  distance: number;
  duration: number;
  price: number;
  driver: {
    name: string;
    rating: number;
    avatar: string;
  };
  status: 'completed' | 'cancelled';
  carType: string;
  paymentMethod: string;
}

// Demo data
const demoRides: RideHistory[] = [
  {
    id: 'RIDE-001',
    date: new Date('2024-03-20T14:30:00'),
    pickup: 'Amsterdam Central Station',
    dropoff: 'Schiphol Airport',
    distance: 15.7,
    duration: 25,
    price: 45.50,
    driver: {
      name: 'Michael B.',
      rating: 4.9,
      avatar: '👨🏻‍✦',
    },
    status: 'completed',
    carType: 'Tesla Model Y',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'RIDE-002',
    date: new Date('2024-03-19T09:15:00'),
    pickup: 'Rotterdam Business Center',
    dropoff: 'Rotterdam Central',
    distance: 3.2,
    duration: 12,
    price: 15.75,
    driver: {
      name: 'Sarah K.',
      rating: 4.8,
      avatar: '👩🏼‍✦',
    },
    status: 'completed',
    carType: 'BMW i4',
    paymentMethod: 'PayPal',
  },
  {
    id: 'RIDE-003',
    date: new Date('2024-03-18T18:45:00'),
    pickup: 'The Hague Beach',
    dropoff: 'City Center',
    distance: 4.5,
    duration: 15,
    price: 18.90,
    driver: {
      name: 'David L.',
      rating: 4.7,
      avatar: '👨🏽‍✦',
    },
    status: 'cancelled',
    carType: 'Mercedes EQS',
    paymentMethod: 'Apple Pay',
  },
];

const RideHistory: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<RideHistory | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShare = (ride: RideHistory) => {
    setSelectedRide(ride);
    setShareModalOpen(true);
  };

  const handleDownload = (ride: RideHistory) => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt for ride:', ride.id);
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
            <h1 className="text-3xl font-bold text-gray-900">Ride History</h1>
            <p className="text-gray-600 mt-2">View and manage your past rides</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Total Rides</h3>
              <p className="text-3xl font-bold text-accent mt-2">24</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Total Distance</h3>
              <p className="text-3xl font-bold text-accent mt-2">342 km</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 backdrop-blur-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
              <p className="text-3xl font-bold text-accent mt-2">€825.50</p>
            </motion.div>
          </div>

          {/* Rides List */}
          <div className="space-y-6">
            {demoRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                      {ride.driver.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {format(ride.date, 'MMM d, yyyy')}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ride.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ride.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(ride.date, 'HH:mm')} • {ride.distance} km • {ride.duration} min
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-primary">From:</span> {ride.pickup}
                        </p>
                        <p className="text-sm">
                          <span className="text-primary">To:</span> {ride.dropoff}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-accent">€{ride.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(ride)}
                        className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-accent rounded-lg transition-colors"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => handleDownload(ride)}
                        className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Driver: {ride.driver.name}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{ride.driver.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{ride.carType}</span>
                      <span>{ride.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && selectedRide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Share Ride Details</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RideHistory; 