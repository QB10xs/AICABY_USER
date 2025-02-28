import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs = [], className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleFAQ = (index: number) => {
    try {
      setOpenIndex(openIndex === index ? null : index);
    } catch (err) {
      setError('An error occurred while toggling FAQ');
      console.error('FAQ toggle error:', err);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!Array.isArray(faqs)) {
    return <div className="text-yellow-500 p-4">No FAQs available at the moment.</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-zinc-200 rounded-lg overflow-hidden bg-white"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors"
          >
            <span className="font-medium text-zinc-900">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-yellow-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-yellow-500" />
            )}
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-zinc-600 border-t border-zinc-100">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
