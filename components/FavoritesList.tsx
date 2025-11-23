
import React from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeList';

interface FavoritesListProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onGoHome: () => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite, onGoHome }) => {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-400 text-4xl mb-6 shadow-sm">
          💔
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz Favori Tarifin Yok</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Tarifleri incelerken sağ üst köşedeki kalp ikonuna tıklayarak buraya kaydedebilirsin.
        </p>
        <button
          onClick={onGoHome}
          className="px-8 py-3 bg-eco-green text-white rounded-full font-bold shadow-lg hover:bg-eco-dark transition-all transform hover:-translate-y-1"
        >
          Tarifleri Keşfet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-10 flex items-center justify-between border-b pb-6 border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Favori Tariflerim</h2>
          <p className="text-gray-500 mt-1">{favorites.length} adet kayıtlı tarif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((recipe, index) => (
          <RecipeCard 
            key={`${recipe.id}-${index}`} 
            recipe={recipe} 
            isFavorite={true}
            onToggleFavorite={() => onToggleFavorite(recipe)} 
          />
        ))}
      </div>
    </div>
  );
};
