
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, SubscriptionStatus } from './types';
import { getMockProfiles } from './services/profileService';
import { generateAITip } from './services/geminiService';
import Navbar from './components/Navbar';
import ProfileCard from './components/ProfileCard';
import SubscriptionModal from './components/SubscriptionModal';
import LoadingSpinner from './components/LoadingSpinner';
import AITipCard from './components/AITipCard';
import { APP_TITLE } from './constants';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(SubscriptionStatus.Free);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);
  const [aiTipError, setAiTipError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = () => {
      setIsLoadingProfiles(true);
      setTimeout(() => { // Simulate API delay
        setProfiles(getMockProfiles(10));
        setIsLoadingProfiles(false);
      }, 1000);
    };
    fetchProfiles();
  }, []);

  const handleOpenSubscriptionModal = useCallback(() => {
    setShowSubscriptionModal(true);
  }, []);

  const handleCloseSubscriptionModal = useCallback(() => {
    setShowSubscriptionModal(false);
  }, []);

  const handleSubscribe = useCallback(() => {
    setSubscriptionStatus(SubscriptionStatus.Subscribed);
    setShowSubscriptionModal(false);
    // Here you would typically handle payment processing
    alert('Subscription successful! You can now view contact details.');
  }, []);

  const handleFetchAITip = useCallback(async () => {
    setIsLoadingTip(true);
    setAiTipError(null);
    setAiTip(null);
    try {
      const tip = await generateAITip();
      setAiTip(tip);
    } catch (error) {
      console.error("Error fetching AI tip:", error);
      setAiTipError(error instanceof Error ? error.message : 'Failed to fetch AI tip. Check API Key and console.');
    } finally {
      setIsLoadingTip(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-lightgray font-sans">
      <Navbar
        title={APP_TITLE}
        subscriptionStatus={subscriptionStatus}
        onSubscribeClick={handleOpenSubscriptionModal}
        onGetAITipClick={handleFetchAITip}
        isFetchingTip={isLoadingTip}
      />

      <main className="container mx-auto p-4 md:p-6">
        {aiTipError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error fetching AI tip: {aiTipError}
          </div>
        )}
        {aiTip && !isLoadingTip && <AITipCard tip={aiTip} onDismiss={() => setAiTip(null)} />}
        
        <h2 className="text-2xl font-semibold text-darkgray mb-6">Discover Profiles</h2>
        
        {isLoadingProfiles ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isSubscribed={subscriptionStatus === SubscriptionStatus.Subscribed}
                onUnlockContact={handleOpenSubscriptionModal}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-mediumgray">No profiles available at the moment.</p>
        )}
      </main>

      <footer className="text-center p-6 text-sm text-mediumgray mt-10 border-t border-gray-300">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
        <p className="mt-1">
          Please use this platform responsibly. Review our Terms of Service and Privacy Policy (placeholders).
        </p>
        <p className="mt-1 text-xs">This is a demo application. Age verification and real transactions are not implemented.</p>
      </footer>

      {showSubscriptionModal && (
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={handleCloseSubscriptionModal}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
};

export default App;
