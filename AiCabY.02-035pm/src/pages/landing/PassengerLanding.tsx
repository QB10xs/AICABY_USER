import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Navigation, Clock, Shield, Car } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PassengerLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <header className="relative z-10 w-full py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white">
                Your AI-Powered
                <span className="text-primary block mt-2">Taxi Experience</span>
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Book your ride with ease using our AI-powered platform
                <span className="block mt-2 text-zinc-500 dark:text-zinc-500">Fast, reliable, and always available</span>
              </p>
              <div className="mt-4 bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border-l-4 border-primary">
                <p className="text-2xl font-semibold text-primary">
                  Ready for a Better Ride Experience?
                </p>
              </div>
              <Link
                to="/signup"
                className="inline-block bg-primary text-black font-semibold py-4 px-8 rounded-xl 
                         hover:bg-primary/90 transition-colors text-lg"
              >
                Book a Ride Now
              </Link>
            </div>
            
            {/* Features Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl dark:shadow-zinc-900/50"
            >
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Why Choose AiCabY?</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">AI-Powered Chat</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Natural conversation for booking and support</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Navigation className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Smart Navigation</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Optimal routes and real-time updates</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">24/7 Availability</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Book a ride anytime, anywhere</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Safety First</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Advanced safety features and verified drivers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Tagline Section */}
      <section className="py-16 bg-zinc-900/95 dark:bg-zinc-900/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-50"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            <span className="text-primary font-extrabold inline-flex items-center gap-2">
              <div className="bg-primary rounded-xl p-2 inline-flex items-center justify-center">
                <Car className="w-6 h-6 text-black" />
              </div>
              AiCabY:
            </span> Your Ride, Your Way,
            <span className="text-primary font-extrabold"> Your Comfort.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-zinc-200 font-medium max-w-3xl mx-auto"
          >
            Join AiCabY today and experience the future of taxi service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              to="/signup"
              className="inline-block bg-primary text-black font-bold py-5 px-10 rounded-xl 
                       hover:bg-primary/90 transition-all duration-300 text-xl shadow-xl hover:shadow-2xl 
                       hover:scale-105 transform"
            >
              Book a Ride Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PassengerLanding;
