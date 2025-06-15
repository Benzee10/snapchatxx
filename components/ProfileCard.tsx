
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { WHATSAPP_ICON_SVG, TELEGRAM_ICON_SVG } from '../constants';

interface ProfileCardProps {
  profile: UserProfile;
  isSubscribed: boolean;
  onUnlockContact: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isSubscribed, onUnlockContact }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + profile.photos.length) % profile.photos.length);
  };

  const openWhatsApp = (number?: string) => {
    if (number) {
      window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
    }
  };

  const openTelegram = (username?: string) => {
    if (username) {
      window.open(`https://t.me/${username.replace('@', '')}`, '_blank');
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl flex flex-col">
      <div className="relative h-64 sm:h-72 md:h-80">
        <img 
          src={profile.photos[currentPhotoIndex]} 
          alt={`${profile.name}'s photo ${currentPhotoIndex + 1}`} 
          className="w-full h-full object-cover" 
        />
        {profile.photos.length > 1 && (
          <>
            <button 
              onClick={prevPhoto} 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
              aria-label="Previous photo"
            >
              &#10094;
            </button>
            <button 
              onClick={nextPhoto} 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
              aria-label="Next photo"
            >
              &#10095;
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {profile.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-gray-400 opacity-75'}`}
                  aria-label={`Go to photo ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-darkgray mb-1">{profile.name}, {profile.age}</h3>
        <p className="text-sm text-mediumgray mb-3">{profile.location}</p>
        <p className="text-mediumgray text-sm mb-4 flex-grow leading-relaxed">{profile.bio}</p>

        {profile.interests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-mediumgray uppercase mb-1">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 5).map(interest => (
                <span key={interest} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{interest}</span>
              ))}
            </div>
          </div>
        )}

        {isSubscribed ? (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-darkgray mb-2">Contact Info:</h4>
            <div className="flex flex-col space-y-2">
              {profile.contactInfo.whatsapp && (
                <button 
                  onClick={() => openWhatsApp(profile.contactInfo.whatsapp)}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors duration-200 py-2 px-3 bg-green-50 rounded-lg justify-center"
                >
                  <span dangerouslySetInnerHTML={{ __html: WHATSAPP_ICON_SVG }} />
                  <span>Chat on WhatsApp</span>
                </button>
              )}
              {profile.contactInfo.telegram && (
                <button 
                  onClick={() => openTelegram(profile.contactInfo.telegram)}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors duration-200 py-2 px-3 bg-blue-50 rounded-lg justify-center"
                >
                  <span dangerouslySetInnerHTML={{ __html: TELEGRAM_ICON_SVG }} />
                  <span>Message on Telegram</span>
                </button>
              )}
              {!profile.contactInfo.whatsapp && !profile.contactInfo.telegram && (
                <p className="text-sm text-mediumgray">No contact information provided.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={onUnlockContact}
              className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Unlock Contact Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
