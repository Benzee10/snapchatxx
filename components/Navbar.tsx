
import React from 'react';
import { SubscriptionStatus } from '../types';

interface NavbarProps {
  title: string;
  subscriptionStatus: SubscriptionStatus;
  onSubscribeClick: () => void;
  onGetAITipClick: () => void;
  isFetchingTip: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, subscriptionStatus, onSubscribeClick, onGetAITipClick, isFetchingTip }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-primary">{title}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onGetAITipClick}
              disabled={isFetchingTip}
              className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-pink-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {isFetchingTip ? 'Getting Tip...' : 'Get AI Connection Tip'}
            </button>
            {subscriptionStatus === SubscriptionStatus.Free && (
              <button
                onClick={onSubscribeClick}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                Subscribe
              </button>
            )}
            {subscriptionStatus === SubscriptionStatus.Subscribed && (
              <span className="px-3 py-2 text-sm font-medium text-secondary border border-secondary rounded-md">
                Subscribed ✨
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
