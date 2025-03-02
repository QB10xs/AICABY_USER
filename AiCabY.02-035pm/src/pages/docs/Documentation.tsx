import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';
import FAQSection from '../../components/faq/FAQSection';
import { driverFAQs } from '../../data/driverFAQs';

type TabType = 'faq' | 'mediation' | 'refund' | 'guidelines';

const Documentation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('faq');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'faq' || tab === 'mediation' || tab === 'refund' || tab === 'guidelines')) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: TabType) => {
    try {
      setActiveTab(tab);
    } catch (err) {
      setError('An error occurred while switching tabs');
      console.error('Tab switch error:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 p-8 bg-red-50 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center bg-zinc-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 p-2 rounded-xl">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl font-bold">AI CABY</span>
        </div>
        <Link 
          to="/driver"
          className="flex items-center space-x-2 text-zinc-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Driver Page</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-zinc-900 mb-8">
          Documentation
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-zinc-200">
          <button
            onClick={() => handleTabChange('faq')}
            className={'py-4 px-6 font-medium transition-colors ' + (activeTab === 'faq' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-600 hover:text-yellow-500')}
          >
            FAQ
          </button>
          <button
            onClick={() => handleTabChange('mediation')}
            className={'py-4 px-6 font-medium transition-colors ' + (activeTab === 'mediation' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-600 hover:text-yellow-500')}
          >
            Mediation Terms
          </button>
          <button
            onClick={() => handleTabChange('refund')}
            className={'py-4 px-6 font-medium transition-colors ' + (activeTab === 'refund' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-600 hover:text-yellow-500')}
          >
            Refund Policy
          </button>
          <button
            onClick={() => handleTabChange('guidelines')}
            className={'py-4 px-6 font-medium transition-colors ' + (activeTab === 'guidelines' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-zinc-600 hover:text-yellow-500')}
          >
            Community Guidelines
          </button>
        </div>

        {/* FAQ Content */}
        {activeTab === 'faq' && (
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              Frequently Asked Questions
            </h2>
            <FAQSection faqs={driverFAQs} />
          </div>
        )}

        {/* Mediation Terms Content */}
        {activeTab === 'mediation' && (
          <div className="prose prose-zinc max-w-none">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              AICABY Mediation by Support Team - Terms and Conditions
            </h2>
            
            <p className="text-zinc-600 mb-8">
              These Terms and Conditions govern the process of mediation by the AICABY Support Team for resolving disputes between drivers and passengers on the AICABY platform. By agreeing to use AICABY's services, both drivers and passengers acknowledge and agree to the following terms when a dispute arises:
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">1. Scope of Mediation</h3>
            <p className="text-zinc-600 mb-4">The Mediation by Support Team process applies to disputes related to:</p>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li><strong>Fare disputes</strong>: Any disagreement regarding the fare charged or agreed upon.</li>
              <li><strong>Service quality</strong>: Issues concerning the quality of the ride, vehicle condition, or driver/passenger behavior.</li>
              <li><strong>Payment issues</strong>: Discrepancies in the payment method or amount agreed upon before the ride.</li>
              <li><strong>Cancellations</strong>: Disputes arising from cancellations or failure to meet agreed-upon pickup terms.</li>
            </ul>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">2. Submission of Evidence</h3>
            <p className="text-zinc-600 mb-4">Both the driver and the passenger must provide supporting evidence related to the dispute, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li>Screenshots of in-app conversations.</li>
              <li>Photos documenting any issues (e.g., vehicle condition or damages).</li>
              <li>Detailed explanations of the events leading to the dispute.</li>
              <li>Ride details, including GPS tracking, fare breakdown, and communication logs.</li>
            </ul>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">3. Mediation Process</h3>
            <p className="text-zinc-600 mb-4">Upon receiving a dispute:</p>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li><strong>Review of Evidence</strong>: The AICABY Mediation Team will carefully review the evidence provided by both parties.</li>
              <li><strong>Communication</strong>: The Mediation Team may contact either party for further clarification or additional information.</li>
              <li><strong>Resolution Timeline</strong>: AICABY aims to resolve disputes within 3-5 business days.</li>
            </ul>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">4. Contact Information</h3>
            <p className="text-zinc-600 mb-4">For any questions or concerns related to the Mediation by Support Team process, please contact us at:</p>
            <p className="text-zinc-600">
              Email:{' '}
              <a href="mailto:support@aicaby.com" className="text-yellow-500 hover:text-yellow-600 hover:underline">
                support@aicaby.com
              </a>
            </p>
          </div>
        )}

        {/* Refund Policy Content */}
        {activeTab === 'refund' && (
          <div className="prose prose-zinc max-w-none">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              AICABY Refund Policy
            </h2>
            
            <p className="text-zinc-600 mb-8">
              At AICABY, we are committed to providing a fair, transparent, and efficient platform for both drivers and passengers. Since AICABY is a peer-to-peer platform, drivers and passengers are responsible for mutually agreeing on the terms of each ride before it starts. This includes fare, payment method, and any special requests.
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">1. Pre-Ride Agreement</h3>
            <p className="text-zinc-600 mb-4">Before the ride begins, both drivers and passengers must agree to the following:</p>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li><strong>Fare</strong>: The total fare amount for the ride, as calculated by the app or negotiated beforehand.</li>
              <li><strong>Payment Method</strong>: The method of payment, which can include cash, card, or Tikkie, must be mutually agreed upon before the ride starts.</li>
              <li><strong>Special Conditions</strong>: Any specific requests, such as extra stops, route preferences, or handling of luggage, should be discussed and agreed upon before pickup.</li>
            </ul>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">2. Refund Eligibility</h3>
            <p className="text-zinc-600 mb-4">Refunds are only considered in the following circumstances:</p>
            
            <h4 className="text-xl font-bold text-zinc-900 mt-8 mb-4">A. Passenger-Initiated Refunds:</h4>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li><strong>No-Show by Driver</strong>: If the driver does not show up within 10-15 minutes.</li>
              <li><strong>Unacceptable Ride Conditions</strong>: If conditions are unsafe or unsanitary.</li>
              <li><strong>Driver Cancellations</strong>: If driver cancels after accepting.</li>
            </ul>

            <h4 className="text-xl font-bold text-zinc-900 mt-8 mb-4">B. Driver-Initiated Refunds:</h4>
            <ul className="list-disc pl-6 mb-8 text-zinc-600">
              <li><strong>Passenger No-Show</strong>: If passenger is not at pickup within 10-15 minutes.</li>
              <li><strong>Uncooperative Passenger</strong>: If passenger behavior is unsafe or violates rules.</li>
            </ul>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">3. Refund Request Process</h3>
            <ol className="list-decimal pl-6 mb-8 text-zinc-600">
              <li>Submit request through AICABY app within 24 hours</li>
              <li>Provide ride ID and supporting evidence</li>
              <li>Wait for review (3-5 business days)</li>
              <li>Receive decision and refund if eligible</li>
            </ol>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">4. Contact Information</h3>
            <p className="text-zinc-600">
              For refund-related inquiries, contact us at:{' '}
              <a href="mailto:support@aicaby.com" className="text-yellow-500 hover:text-yellow-600 hover:underline">
                support@aicaby.com
              </a>
            </p>
          </div>
        )}

        {/* Community Guidelines Content */}
        {activeTab === 'guidelines' && (
          <div className="prose prose-zinc max-w-none">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              AICABY Driver Community Guidelines
            </h2>
            
            <p className="text-zinc-600 mb-8">
              At AICABY, our mission is to empower drivers with more control and freedom while ensuring that both drivers and passengers enjoy a safe, professional, and comfortable experience.
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">1. Respectful and Professional Behavior</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="font-bold mb-4">What we expect:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Respectful treatment</strong>: Treat every passenger with dignity and respect.</li>
                <li><strong>Open communication</strong>: Respond promptly to questions or concerns.</li>
                <li><strong>Appropriate behavior</strong>: Maintain professional boundaries.</li>
              </ul>
              <p className="text-sm italic">Violations may result in warnings or account suspension.</p>
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">2. Punctuality and Reliability</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="font-bold mb-4">Key Requirements:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Arrive on time at pickup locations</li>
                <li>Avoid unnecessary cancellations</li>
                <li>Complete rides as agreed</li>
              </ul>
              <p className="text-sm italic">Frequent violations may affect your account status.</p>
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">3. Vehicle and Safety Standards</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="font-bold mb-4">Requirements:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintain a clean, well-maintained vehicle</li>
                <li>Follow all traffic laws and safety regulations</li>
                <li>Conduct regular vehicle inspections</li>
              </ul>
              <p className="text-sm italic">Safety violations may result in immediate suspension.</p>
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">4. Payment and Honesty</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="font-bold mb-4">Guidelines:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Charge only the agreed fare</li>
                <li>Accept passenger's preferred payment method</li>
                <li>Maintain transparency in all transactions</li>
              </ul>
              <p className="text-sm italic">Payment violations may lead to permanent deactivation.</p>
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">5. Privacy and Data Protection</h3>
            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h4 className="font-bold mb-4">Requirements:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Protect passenger personal information</li>
                <li>Only contact passengers through the platform</li>
                <li>Report any data breaches immediately</li>
              </ul>
              <p className="text-sm italic">Privacy violations will result in immediate review.</p>
            </div>

            <div className="bg-zinc-50 p-6 rounded-lg mt-12">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p>
                Contact our support team for guidance:{' '}
                <a href="mailto:support@aicaby.com" className="text-yellow-500 hover:text-yellow-600 hover:underline">
                  support@aicaby.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;
