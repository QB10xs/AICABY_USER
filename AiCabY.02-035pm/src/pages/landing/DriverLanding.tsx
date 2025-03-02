import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Shield, Award, Car } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const DriverLanding: React.FC = () => {
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary p-2 rounded-xl inline-flex">
                    <Car className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-primary font-bold">AiCabY</span>
                </div>
                <span className="block">Empowering Drivers,</span>
                <span className="text-primary block mt-2">Revolutionizing Rides</span>
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Join our platform and earn more with AI-powered efficiency
                <span className="block mt-2 text-zinc-500 dark:text-zinc-500">Flexible hours, better earnings</span>
              </p>
              <div className="mt-4 bg-primary/10 dark:bg-primary/20 p-4 rounded-xl border-l-4 border-primary">
                <p className="text-2xl font-semibold text-primary">
                  Ready to Start Your Journey?
                </p>
              </div>
              <Link
                to="/driver/signup"
                className="inline-block bg-primary text-black font-bold py-5 px-10 rounded-xl 
                         hover:bg-primary/90 transition-all duration-300 text-xl shadow-xl hover:shadow-2xl 
                         hover:scale-105 transform"
              >
                Start Driving Today
              </Link>
            </div>
            
            {/* Features Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl dark:shadow-zinc-900/50"
            >
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Why Drive with AiCabY?</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <DollarSign className="w-6 h-6 text-primary dark:text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Competitive Earnings</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Higher rates and smart trip matching</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Flexible Hours</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Work when you want, how you want</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Safety & Support</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">24/7 support and safety features</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">Rewards Program</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">Earn bonuses and special perks</p>
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
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="bg-primary p-2 rounded-xl inline-flex">
                <Car className="w-5 h-5 text-black" />
              </div>
              <span className="text-primary font-bold">AiCabY</span>
            </div> Your Ride, Your Way,
            <span className="text-primary font-extrabold"> Your Success.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-zinc-200 font-medium max-w-3xl mx-auto"
          >
            Join AiCabY today and be part of the future of taxi service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              to="/driver/signup"
              className="inline-block bg-primary text-black font-bold py-5 px-10 rounded-xl 
                       hover:bg-primary/90 transition-all duration-300 text-xl shadow-xl hover:shadow-2xl 
                       hover:scale-105 transform"
            >
              Start Driving Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="py-16 bg-white dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Documentation</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Everything you need to know about AiCabY</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* About Us */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">About Us</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Learn about our mission, vision, and the team behind AiCabY.</p>
            </div>

            {/* How It Works */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">How It Works</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Step-by-step guide to using our platform effectively.</p>
            </div>

            {/* FAQ */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">FAQ</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Find answers to commonly asked questions.</p>
            </div>

            {/* Privacy Policy */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Privacy Policy</h3>
              <p className="text-zinc-600 dark:text-zinc-400">How we protect and handle your data.</p>
            </div>

            {/* Terms of Service */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Terms of Service</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Our platform's terms and conditions.</p>
            </div>

            {/* Contact Us */}
            <div className="bg-zinc-50 dark:bg-zinc-700/50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">Contact Us</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Get in touch with our support team.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DriverLanding;
