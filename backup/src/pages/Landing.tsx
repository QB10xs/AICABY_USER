import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 p-2 rounded-xl">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-zinc-900 text-xl font-bold">AI CABY</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/signin" 
            className="px-4 py-2 text-zinc-900 hover:text-yellow-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-zinc-900">
              Your AI-Powered
              <span className="text-yellow-500 block mt-2">Taxi Experience</span>
            </h1>
            <p className="text-lg text-zinc-600 max-w-lg">
              Experience the future of transportation with AI CABY. Smart bookings, 
              real-time tracking, and personalized service - all through natural conversation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 
                         transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-yellow-500 text-yellow-500 rounded-xl 
                         hover:bg-yellow-500 hover:text-white transition-all transform 
                         hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {[
                { title: 'AI Assistant', desc: 'Natural language booking' },
                { title: 'Smart Routes', desc: 'Optimal path finding' },
                { title: 'Real-time', desc: 'Live tracking & updates' },
                { title: 'Secure', desc: 'End-to-end encryption' },
              ].map((feature) => (
                <div key={feature.title} className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900">{feature.title}</h3>
                  <p className="text-zinc-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square">
              {/* Animated Circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [90, 0, 90],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-10 bg-gradient-to-l from-yellow-500/30 to-yellow-600/30 rounded-full"
              />
              
              {/* Taxi Icon */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-20 bg-yellow-500 rounded-3xl shadow-2xl flex items-center justify-center"
              >
                <Car className="w-32 h-32 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-zinc-600">© 2025 AI CABY. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-zinc-600 hover:text-yellow-500">Privacy</a>
              <a href="#" className="text-zinc-600 hover:text-yellow-500">Terms</a>
              <a href="#" className="text-zinc-600 hover:text-yellow-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
