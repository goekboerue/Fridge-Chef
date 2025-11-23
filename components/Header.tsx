
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentState: AppState;
  onGoHome: () => void;
  onShowFavorites: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentState, onGoHome, onShowFavorites, favoriteCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={onGoHome}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🥗</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Buzdolabı<span className="text-eco-green">Şefi</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-eco-green"></span>
                Ekonomik
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Sürdürülebilir
              </span>
            </div>

            <button 
              onClick={onShowFavorites}
              className={`relative p-2 rounded-full transition-colors ${
                currentState === AppState.FAVORITES 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
              }`}
              aria-label="Favorilerim"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={currentState === AppState.FAVORITES ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
