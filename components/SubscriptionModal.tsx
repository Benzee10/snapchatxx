
import React from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-darkgray">Unlock Full Access</h2>
          <button onClick={onClose} className="text-mediumgray hover:text-darkgray text-2xl">&times;</button>
        </div>
        <p className="text-mediumgray mb-6">
          Subscribe to unlock contact information and connect directly with profiles you're interested in.
        </p>
        <div className="space-y-3">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-700">Premium Plan</h3>
                <p className="text-emerald-600 text-sm">Access all contact details, unlimited profile views, and more!</p>
                <p className="text-2xl font-bold text-emerald-700 mt-2">$9.99 <span className="text-sm font-normal">/ month</span></p>
            </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 border border-mediumgray text-mediumgray font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={onSubscribe}
            className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            Subscribe Now
          </button>
        </div>
         <p className="text-xs text-mediumgray mt-6 text-center">
          This is a simulated subscription. No actual payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionModal;
