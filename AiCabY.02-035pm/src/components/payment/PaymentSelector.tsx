import React, { useState } from 'react';
import { X, CreditCard, Wallet, Building2, Banknote, Loader2, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: string) => void;
}

const paymentMethods = [
  {
    id: 'cash',
    label: 'Cash',
    icon: Banknote,
    description: 'Pay with cash to driver'
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay with your card'
  },
  {
    id: 'wallet',
    label: 'Digital Wallet',
    icon: Wallet,
    description: 'Apple Pay, Google Pay, etc.'
  },
  {
    id: 'corporate',
    label: 'Corporate Account',
    icon: Building2,
    description: 'Use your company account'
  }
];

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (methodId: string) => {
    try {
      setSelectedId(methodId);
      setIsLoading(true);
      setError(null);

      // Simulate payment method validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) { // 10% chance of error for demo
            reject(new Error('Payment method validation failed'));
          }
          resolve(true);
        }, 1000);
      });

      const method = paymentMethods.find(m => m.id === methodId);
      if (method) {
        onSelect(method.label);
        onClose();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to select payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 20 }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
      >
        <motion.div
          variants={modalVariants}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-[#2A2A2A] w-full sm:w-96 rounded-t-xl sm:rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#F7C948]/20 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Select Payment Method</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Payment Methods */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="p-4 space-y-2"
          >
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                variants={itemVariants}
                disabled={isLoading}
                onClick={() => handleSelect(method.id)}
                className={`
                  w-full p-4 rounded-lg transition-all flex items-center gap-4 group
                  ${selectedId === method.id 
                    ? 'bg-[#F7C948]/20 border-[#F7C948]' 
                    : 'bg-white/5 hover:bg-[rgba(247,201,72,0.1)] border-transparent'
                  }
                  border
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${selectedId === method.id 
                    ? 'bg-[#F7C948] text-black' 
                    : 'bg-[#F7C948]/10 text-[#F7C948] group-hover:bg-[#F7C948]/20'
                  }
                `}>
                  {selectedId === method.id && isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : selectedId === method.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <method.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="text-white font-medium">{method.label}</div>
                  <div className="text-white/60 text-sm">{method.description}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 pb-4"
              >
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="text-red-500 text-sm">{error}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="p-4 border-t border-[#F7C948]/20">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentSelector; 