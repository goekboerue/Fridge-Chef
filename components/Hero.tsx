import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20 bg-gradient-to-b from-eco-light/30 to-transparent">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          "Bugün ne pişirsem?" <br className="hidden sm:block" />
          derdine son.
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Buzdolabının fotoğrafını çek, elindeki malzemelerle yapabileceğin 
          <span className="font-semibold text-eco-dark mx-1">ekonomik</span> ve 
          <span className="font-semibold text-eco-dark mx-1">lezzetli</span> 
          tarifleri anında öğren. İsrafı önle, bütçeni koru.
        </p>
        
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-eco-green rounded-full hover:bg-eco-dark shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green"
        >
          📸 Fotoğraf Yükle ve Başla
        </button>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-600 text-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-2">🌱</div>
            <span className="font-semibold">Sıfır Atık</span>
            <span className="text-gray-500">Sebzeler çöpe gitmesin</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-2">💰</div>
            <span className="font-semibold">Tasarruf Et</span>
            <span className="text-gray-500">Ekstra alışverişe gerek yok</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-2">👨‍🍳</div>
            <span className="font-semibold">Şef Dokunuşu</span>
            <span className="text-gray-500">Yaratıcı tarifler</span>
          </div>
        </div>
      </div>
    </div>
  );
};