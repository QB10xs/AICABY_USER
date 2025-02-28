import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

const Ridex: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">RIDEX</h1>
          <p className="text-gray-600 mt-2">Advanced ride management and analytics</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ride Statistics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ride Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Rides</span>
                <span className="text-gray-900 font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <span className="text-gray-900 font-medium">4.8/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="text-gray-900 font-medium">98%</span>
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Time</span>
                <span className="text-gray-900 font-medium">2.3 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On-Time Rate</span>
                <span className="text-gray-900 font-medium">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="text-gray-900 font-medium">4.9/5.0</span>
              </div>
            </div>
          </motion.div>

          {/* Revenue Analytics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Analytics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today's Earnings</span>
                <span className="text-gray-900 font-medium">$342.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Average</span>
                <span className="text-gray-900 font-medium">$2,150.75</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Projection</span>
                <span className="text-gray-900 font-medium">$8,600.00</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Ridex; 