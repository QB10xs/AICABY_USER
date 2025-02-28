import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

const MediationTerms: React.FC = () => {
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
          AICABY Mediation by Support Team - Terms and Conditions
        </h1>

        <div className="prose prose-zinc max-w-none">
          <p className="text-zinc-600 mb-8">
            These Terms and Conditions govern the process of mediation by the AICABY Support Team for resolving disputes between drivers and passengers on the AICABY platform. By agreeing to use AICABY's services, both drivers and passengers acknowledge and agree to the following terms when a dispute arises:
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">1. Scope of Mediation</h2>
          <p className="text-zinc-600 mb-4">The Mediation by Support Team process applies to disputes related to:</p>
          <ul className="list-disc pl-6 mb-8 text-zinc-600">
            <li><strong>Fare disputes</strong>: Any disagreement regarding the fare charged or agreed upon.</li>
            <li><strong>Service quality</strong>: Issues concerning the quality of the ride, vehicle condition, or driver/passenger behavior.</li>
            <li><strong>Payment issues</strong>: Discrepancies in the payment method or amount agreed upon before the ride.</li>
            <li><strong>Cancellations</strong>: Disputes arising from cancellations or failure to meet agreed-upon pickup terms.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">2. Submission of Evidence</h2>
          <p className="text-zinc-600 mb-4">Both the driver and the passenger must provide supporting evidence related to the dispute, including but not limited to:</p>
          <ul className="list-disc pl-6 mb-8 text-zinc-600">
            <li>Screenshots of in-app conversations.</li>
            <li>Photos documenting any issues (e.g., vehicle condition or damages).</li>
            <li>Detailed explanations of the events leading to the dispute.</li>
            <li>Ride details, including GPS tracking, fare breakdown, and communication logs.</li>
          </ul>
          <p className="text-zinc-600 mb-8">Evidence must be submitted within 48 hours of receiving the mediation notice. Failure to provide evidence within this timeframe may affect the final decision.</p>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">3. Mediation Process</h2>
          <p className="text-zinc-600 mb-4">Upon receiving a dispute:</p>
          <ul className="list-disc pl-6 mb-8 text-zinc-600">
            <li><strong>Review of Evidence</strong>: The AICABY Mediation Team will carefully review the evidence provided by both parties. This may include app-generated data such as GPS records, payment logs, and ride history.</li>
            <li><strong>Communication</strong>: The Mediation Team may contact either party for further clarification or additional information.</li>
            <li><strong>Resolution Timeline</strong>: AICABY aims to resolve disputes within 3-5 business days. However, in complex cases, this period may be extended, and both parties will be notified.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">4. Possible Outcomes</h2>
          <p className="text-zinc-600 mb-4">The Mediation Team will issue a final decision based on the evidence and facts of the case. Possible outcomes include:</p>
          <ul className="list-disc pl-6 mb-8 text-zinc-600">
            <li><strong>Refunds or fare adjustments</strong>: If the passenger is found to have been overcharged or the driver's cancellation is deemed unjustified, a refund or fare adjustment may be granted.</li>
            <li><strong>Cancellation fees</strong>: If a party cancels a ride without a valid reason, a cancellation fee may be applied.</li>
            <li><strong>Account actions</strong>: In cases of misconduct, AICABY reserves the right to issue warnings, suspend accounts temporarily, or permanently deactivate accounts based on the severity of the violation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">5. Confidentiality</h2>
          <p className="text-zinc-600 mb-8">All information provided during the mediation process will remain confidential. Both the driver and the passenger are prohibited from disclosing details of the dispute, the mediation process, or the final decision to third parties.</p>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">6. Limitation of Liability</h2>
          <p className="text-zinc-600 mb-8">AICABY's role in the mediation process is to facilitate the fair resolution of disputes between drivers and passengers. AICABY is not responsible for any losses, damages, or additional costs incurred by either party as a result of the dispute or the mediation process. The platform's decision is final and binding, and no further liability is assumed.</p>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">7. Acceptance of Terms</h2>
          <p className="text-zinc-600 mb-8">By using the AICABY platform and participating in the mediation process, both drivers and passengers agree to these Terms and Conditions. Continued use of the platform constitutes acceptance of these terms.</p>
          <p className="text-zinc-600 mb-8">AICABY reserves the right to modify or update these Terms and Conditions at any time. Any changes will be communicated to users via email or in-app notifications.</p>

          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">8. Contact Information</h2>
          <p className="text-zinc-600 mb-4">For any questions or concerns related to the Mediation by Support Team process, please contact us at:</p>
          <p className="text-zinc-600">
            Email:{' '}
            <a href="mailto:support@aicaby.com" className="text-yellow-500 hover:text-yellow-600 hover:underline">
              support@aicaby.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediationTerms;
