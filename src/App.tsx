import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Navigation, Clock, Shield } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import { useDarkMode } from './hooks/useDarkMode';
import { FeedbackProvider } from './contexts/FeedbackContext';
import PageTransition from './components/ui/PageTransition';

const App: React.FC = () => {
  const location = useLocation();
  useDarkMode();

  const features = [
    {
      icon: MessageSquare,
      title: 'Multilingual Support',
      desc: 'Chat in any language and book rides effortlessly. Our translation system handles over 95 languages with remarkable accuracy.'
    },
    {
      icon: Navigation,
      title: 'Smart Routing',
      desc: 'Real-time traffic analysis and optimal route calculation.'
    },
    {
      icon: Clock,
      title: 'Scheduled Rides',
      desc: 'Book rides up to a week in advance with smart scheduling.'
    },
    {
      icon: Shield,
      title: 'Enhanced Safety',
      desc: 'Advanced driver safety protocols and real-time monitoring.'
    }
  ];

  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-[#FFFAF0] dark:bg-zinc-900 transition-colors">
        <Navbar />
        
        <PageTransition location={location.pathname}>
          <main className="relative z-10">
            {/* Hero Section */}
            <section className="w-full py-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="flex-1 space-y-8">
                    <h1 className="text-5xl lg:text-6xl font-bold text-[#2A2A2A] dark:text-white">
                      Your AI-Powered
                      <span className="text-taxi-yellow block mt-2">Taxi Experience</span>
                    </h1>
                    <p className="text-xl text-text-primary-light dark:text-text-primary-dark">
                      Book your ride with ease using our AI-powered platform
                      <span className="block mt-2 opacity-80">Fast, reliable, and always available</span>
                    </p>
                    <Link
                      to="/signup"
                      className="inline-block bg-taxi-yellow hover:bg-taxi-yellow/90 text-night-black 
                               font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
                    >
                      Get Started Today
                    </Link>
                  </div>
                  
                  {/* Features Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 glass-card p-8 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-taxi-yellow/10 
                                  rounded-full -translate-y-16 translate-x-16" />
                    <div className="space-y-6">
                      {features.map((feature) => (
                        <div key={feature.title} className="flex items-center gap-4">
                          <div className="p-3 bg-taxi-yellow/10 rounded-xl">
                            <feature.icon className="w-6 h-6 text-taxi-yellow" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* Advanced Features Section */}
            <section className="w-full py-20 bg-white dark:bg-zinc-800">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-[#2A2A2A] dark:text-white mb-4 text-center">Advanced Features</h2>
                <p className="text-xl text-[#4B5563] dark:text-zinc-300 text-center mb-12">AI-Powered Smart Ride</p>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                    {features.map((feature) => (
                      <div key={feature.title} className="flex items-start space-x-4">
                        <feature.icon className="w-6 h-6 text-[#F59E0B] mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-[#2A2A2A] dark:text-white">{feature.title}</h3>
                          <p className="text-[#4B5563] dark:text-zinc-300">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-zinc-900 rounded-2xl p-8 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent" />
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-6">Community Benefits</h3>
                      <p className="text-lg text-zinc-400 mb-8">
                        Join a movement where drivers and passengers work together to reshape the taxi industry.
                      </p>
                      <Link
                        to="/signup"
                        className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold py-3 px-6 rounded-xl
                                transition-colors shadow-lg hover:shadow-xl"
                      >
                        Join Our Community
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 w-full py-20 bg-zinc-900 text-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <h2 className="text-4xl font-bold text-white">Ready for a Better Ride Experience?</h2>
                  <p className="text-xl text-zinc-400">Join AICABY today and experience the future of taxi service.</p>
                  <Link
                    to="/signup"
                    className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-4 px-8 rounded-xl
                            transition-colors text-lg"
                  >
                    Book a Ride Now
                  </Link>
                  <p className="text-lg text-yellow-500 font-semibold mt-8">AICABY: Your Ride, Your Way, Your Comfort.</p>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full py-12 bg-zinc-900 border-t border-zinc-800">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-white font-semibold mb-4">AICABY</h3>
                    <p className="text-zinc-400">Empowering passengers with AI-powered taxi service.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">About Us</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">How It Works</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">FAQ</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">Privacy Policy</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">Terms of Service</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">Contact Us</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Connect</h3>
                    <ul className="space-y-2">
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">Twitter</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">LinkedIn</Link></li>
                      <li><Link to="#" className="text-zinc-400 hover:text-yellow-500">Facebook</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-400">
                  © {new Date().getFullYear()} AICABY. All rights reserved.
                </div>
              </div>
            </footer>
          </main>
        </PageTransition>
      </div>
    </FeedbackProvider>
  );
};

export default App;