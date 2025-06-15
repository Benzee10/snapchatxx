
import React from 'react';

interface AITipCardProps {
  tip: string;
  onDismiss: () => void;
}

const AITipCard: React.FC<AITipCardProps> = ({ tip, onDismiss }) => {
  return (
    <div className="bg-pink-50 border-l-4 border-accent text-pink-700 p-4 mb-6 rounded-md shadow-md relative" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-accent mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11H9v2h2V7zm0 4H9v4h2v-4z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">AI Connection Tip ✨</p>
          <p className="text-sm">{tip}</p>
        </div>
      </div>
      <button 
        onClick={onDismiss} 
        className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-xl font-bold"
        aria-label="Dismiss tip"
      >
        &times;
      </button>
    </div>
  );
};

export default AITipCard;
