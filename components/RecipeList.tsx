import React, { useRef, useState } from 'react';
import { AnalysisResult, Recipe } from '../types';

interface RecipeListProps {
  data: AnalysisResult;
  onReset: () => void;
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ data, onReset, favorites, onToggleFavorite }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Detected Ingredients Section */}
      <div className="mb-12 text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tespit Edilen Malzemeler</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {data.detectedIngredients.map((item, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 capitalize text-sm font-medium"
            >
              ✅ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.recipes.map((recipe, index) => {
          const isFav = favorites.some(fav => fav.id === recipe.id);
          return (
            <div 
              key={index} 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <RecipeCard 
                recipe={recipe} 
                isFavorite={isFav} 
                onToggleFavorite={() => onToggleFavorite(recipe)} 
              />
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-1"
        >
          🔄 Başka Fotoğraf Tara
        </button>
      </div>
    </div>
  );
};

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onToggleFavorite }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Determine color based on difficulty
  const difficultyColor = {
    'Kolay': 'text-green-600 bg-green-50',
    'Orta': 'text-yellow-600 bg-yellow-50',
    'Zor': 'text-red-600 bg-red-50'
  }[recipe.difficulty] || 'text-gray-600 bg-gray-50';

  const hasMissingIngredients = recipe.missingIngredients && recipe.missingIngredients.length > 0;

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    // Hide buttons for screenshot
    setIsSharing(true);

    // Give React a moment to update the DOM (hide buttons)
    setTimeout(async () => {
      try {
        if (cardRef.current) {
          // Access html2canvas from global window object (loaded via script tag in index.html)
          // This avoids module resolution issues in Vercel/Production environments
          const html2canvas = (window as any).html2canvas;

          if (!html2canvas) {
            alert("Paylaşım özelliği şu an yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.");
            setIsSharing(false);
            return;
          }

          const canvas = await html2canvas(cardRef.current, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#ffffff'
          });

          canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
              const file = new File([blob], `BuzdolabiSefi_${recipe.id || 'tarif'}.png`, { type: 'image/png' });

              // Try Native Sharing (Mobile)
              if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                  await navigator.share({
                    files: [file],
                    title: recipe.title,
                    text: `🍽️ ${recipe.title} - Buzdolabı Şefi ile hazırlandı.`
                  });
                } catch (shareError) {
                  console.log('Share dismissed', shareError);
                }
              } 
              // Fallback for Desktop: Download
              else {
                const link = document.createElement('a');
                link.download = `BuzdolabiSefi_${recipe.title}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                alert('Tarif kartı cihazınıza indirildi! 📸');
              }
            }
          }, 'image/png');
        }
      } catch (error) {
        console.error('Screenshot failed:', error);
        alert('Görsel oluşturulamadı, tarayıcınız desteklemiyor olabilir.');
      } finally {
        setIsSharing(false); // Show buttons again
      }
    }, 100);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border transition-all duration-300 flex flex-col h-full hover:shadow-2xl ${hasMissingIngredients ? 'border-orange-200' : 'border-gray-100'}`}
    >
      
      {/* Header Banner for "Missing List" feature */}
      {hasMissingIngredients && (
        <div className="bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center justify-center border-b border-orange-100">
          <span className="mr-2">🛒</span> Küçük Bir Alışverişle Mümkün
        </div>
      )}

      <div className="p-6 flex-grow">
        
        {/* Header Row: Metadata & Action */}
        <div className="flex justify-between items-start mb-4">
          
          {/* Left: Difficulty & Time */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${difficultyColor}`}>
              {recipe.difficulty}
            </span>
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {recipe.prepTime}
            </div>
          </div>

          {/* Right: Actions (Hidden when sharing) */}
          {!isSharing && (
            <div className="flex items-center gap-1 -mt-2 -mr-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                title="Resim Olarak Paylaş"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.345 1.093m0-1.093a2.25 2.25 0 000 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isFavorite ? "#EF4444" : "none"} 
                  stroke={isFavorite ? "#EF4444" : "currentColor"} 
                  strokeWidth="2" 
                  className="w-6 h-6 transition-colors"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight pr-2">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{recipe.description}</p>
        
        {/* Sustainability Score */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-eco-dark">Sürdürülebilirlik Puanı</span>
            <span className="text-eco-green">{recipe.sustainabilityScore}/10</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-eco-green to-teal-500 h-2 rounded-full" 
              style={{ width: `${recipe.sustainabilityScore * 10}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Missing Ingredients Box - Highlighted */}
          {hasMissingIngredients && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Eksik Listesi (Alınacaklar)
              </h4>
              <ul className="text-sm text-orange-700 space-y-1 pl-1">
                {recipe.missingIngredients.map((ing, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 font-bold">•</span>{ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Elimizdeki Malzemeler</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-eco-green">•</span>{ing}
                </li>
              ))}
              {recipe.pantryItems.length > 0 && (
                <li className="text-xs text-gray-400 italic mt-2">
                  + Evdeki malzemeler: {recipe.pantryItems.join(', ')}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <details className="group" open={isSharing}>
          <summary className={`flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-eco-green transition-colors ${isSharing ? 'hidden' : ''}`}>
            <span>Hazırlanışı Gör</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="text-sm text-gray-600 mt-4 space-y-3 pb-2">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-eco-light text-eco-dark flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
          {isSharing && (
             <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400 font-semibold tracking-wide">BUZDOLABI ŞEFİ İLE OLUŞTURULDU</p>
             </div>
          )}
        </details>
      </div>
    </div>
  );
};