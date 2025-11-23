
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { RecipeList } from './components/RecipeList';
import { FavoritesList } from './components/FavoritesList';
import { analyzeFridgeImage } from './services/geminiService';
import { AnalysisResult, AppState, FilterOptions, Recipe } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Favorites State with LocalStorage initialization
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favorites", e);
      return [];
    }
  });

  // Persist favorites when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === recipe.id);
      if (exists) {
        return prev.filter(f => f.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const handleStart = () => {
    const uploaderElement = document.getElementById('uploader-section');
    if (uploaderElement) {
      uploaderElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoHome = () => {
    if (appState === AppState.FAVORITES) {
        // If coming from favorites and has result, go back to results, else home
        if (analysisResult) {
            setAppState(AppState.RESULTS);
        } else {
            setAppState(AppState.IDLE);
        }
    } else {
        setAppState(AppState.IDLE);
        setAnalysisResult(null);
    }
  };

  const handleShowFavorites = () => {
    setAppState(AppState.FAVORITES);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageSelected = async (base64Image: string, filters: FilterOptions) => {
    try {
      setAppState(AppState.ANALYZING);
      setError(null);
      
      const result = await analyzeFridgeImage(base64Image, filters);
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.');
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header 
        currentState={appState}
        onGoHome={handleGoHome}
        onShowFavorites={handleShowFavorites}
        favoriteCount={favorites.length}
      />
      
      <main className="flex-grow">
        {appState === AppState.IDLE && (
          <>
            <Hero onStart={handleStart} />
            <div id="uploader-section" className="py-12 bg-white">
              <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Malzemeleri Tarat</h3>
                <p className="text-gray-500">Önce tercihlerinizi seçin, sonra buzdolabının fotoğrafını çekin.</p>
              </div>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          </>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-eco-green/20 rounded-full animate-ping"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg border border-gray-100">
                <div className="text-4xl animate-bounce">🥗</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buzdolabın Analiz Ediliyor...</h2>
            <p className="text-gray-500 text-center max-w-md">
              Yapay zeka malzemeleri tanıyor, süre ve diyet tercihlerine uygun tarifler oluşturuyor.
              <br/>
              <span className="text-sm text-eco-green mt-2 block font-medium">Bu işlem birkaç saniye sürebilir.</span>
            </p>
          </div>
        )}

        {appState === AppState.RESULTS && analysisResult && (
          <RecipeList 
            data={analysisResult} 
            onReset={handleReset} 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {appState === AppState.FAVORITES && (
          <FavoritesList 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
            onGoHome={() => {
                setAppState(AppState.IDLE);
                setAnalysisResult(null);
            }}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Bir şeyler ters gitti.</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Tekrar Dene
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2024 Buzdolabı Şefi. Sürdürülebilir bir dünya için tasarlandı.</p>
          <div className="mt-2 space-x-4">
            <span>🌱 Sıfır Atık</span>
            <span>💰 Bütçe Dostu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
