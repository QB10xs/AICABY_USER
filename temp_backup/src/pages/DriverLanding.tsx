import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Car,
  Clock,
  MessageSquare,
  Navigation,
  Shield
} from 'lucide-react';

const DriverLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center bg-zinc-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 p-2 rounded-xl">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold">AI CABY</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="px-4 py-2 text-zinc-400 hover:text-yellow-500 transition-colors"
          >
            For Passengers
          </Link>
          <Link 
            to="/signin" 
            className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

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
              <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900">
                AI CABY: Empowering Drivers,
                <span className="text-yellow-500 block mt-2">Revolutionizing Rides</span>
              </h1>
              <p className="text-xl text-zinc-600">
                Keep <span className="text-yellow-500 font-bold">100%</span> of your earnings with just €1.5 per ride
                <span className="block mt-2 text-zinc-500">No commission. No hidden fees. Just fair earnings.</span>
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-xl 
                         transition-colors text-lg shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </motion.button>
            </div>
            
            {/* Monthly Earnings Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 bg-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-16 translate-x-16" />
              <h3 className="text-2xl font-bold text-white mb-6">Monthly Scenario with 300 Rides:</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-zinc-800/50 rounded-xl">
                  <div className="flex items-center text-red-400 mb-2">
                    <span className="text-lg">❌ Traditional Platforms</span>
                  </div>
                  <div className="text-xl text-white">€5,000 earned, minus 20-25% =</div>
                  <div className="text-2xl text-white font-mono mt-2">€3,750 - €4,000 in your pocket</div>
                </div>

                <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center text-yellow-500 mb-2">
                    <span className="text-lg">✓ AI CABY</span>
                  </div>
                  <div className="text-xl text-white">€5,000 earned, minus (300 rides × €1.5) =</div>
                  <div className="text-2xl text-white font-mono mt-2">€4,550 in your pocket</div>
                </div>

                <div className="text-center mt-4 text-yellow-500 font-semibold text-lg">
                  That's an extra €550-€800 every month!
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Why Choose Us Section */}
      <section className="relative z-10 w-full py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose Us?</h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { 
                title: 'Fair & Transparent',
                desc: 'Enjoy a fixed service fee of €1.5 per ride with no hidden costs. What you earn is yours to keep.'
              },
              {
                title: 'Cost Savings',
                desc: 'Save hundreds of euros each month by avoiding commission fees that cut deep into your earnings.'
              },
              {
                title: 'Flexible & Open',
                desc: "Use AI CABY alongside other platforms. We don't demand exclusivity because we understand flexibility is key."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 bg-zinc-800/50 rounded-xl hover:bg-zinc-800/70 transition-colors"
              >
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="relative z-10 w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 text-center">Advanced Features</h2>
          <p className="text-xl text-zinc-600 text-center mb-12">AI-Powered Smart Ride</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Multilingual Support</h3>
                  <p className="text-zinc-600">Chat in any language and book rides effortlessly. Our translation system handles over 95 languages with remarkable accuracy.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Navigation className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Smart Routing</h3>
                  <p className="text-zinc-600">Real-time traffic analysis and optimal route calculation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Scheduled Rides</h3>
                  <p className="text-zinc-600">Book rides up to a week in advance with smart scheduling.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Enhanced Safety</h3>
                  <p className="text-zinc-600">Advanced driver safety protocols and real-time monitoring.</p>
                </div>
              </div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl
                           transition-colors shadow-lg hover:shadow-xl"
                >
                  Join Our Community
                </motion.button>
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
            <h2 className="text-4xl font-bold text-white">Ready to Keep More of What You Earn?</h2>
            <p className="text-xl text-zinc-400">Join AI CABY today and experience the future of ridesharing.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-xl
                       transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              Start Driving Now
            </motion.button>
            <p className="text-lg text-yellow-500 font-semibold mt-8">AI CABY: Your Ride, Your Rules, Your Earnings.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">AI CABY</h3>
              <p className="text-zinc-400">Empowering drivers with fair earnings and smart technology.</p>
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
            © {new Date().getFullYear()} AI CABY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DriverLanding;
