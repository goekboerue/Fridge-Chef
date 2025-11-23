
import React, { useRef, useState } from 'react';
import { FilterOptions } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string, filters: FilterOptions) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Filter states
  const [dietary, setDietary] = useState<FilterOptions['dietary']>('Hepsi');
  const [time, setTime] = useState<FilterOptions['time']>('Farketmez');
  const [mode, setMode] = useState<FilterOptions['mode']>('Standart');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası yükleyin.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64, { dietary, time, mode });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mb-12">
      
      {/* Settings Panel */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="bg-eco-green text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
            Mutfak Modunu Seç
          </h3>
          <p className="text-gray-500 text-sm mt-1 ml-8">Bugün hangi şartlarda yemek yapıyoruz?</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Mode Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'Standart', icon: '🏠', title: 'Standart Mutfak', desc: 'Dengeli, ekonomik ve lezzetli tarifler.' },
              { id: 'Öğrenci Evi', icon: '🎓', title: 'Öğrenci Evi', desc: 'Min. bulaşık, en ucuz, pratik.' },
              { id: 'Fit Yaşam', icon: '💪', title: 'Fit & Sağlıklı', desc: 'Yüksek protein, düşük karb, kalori hesabı.' },
              { id: 'Sadece Bunlar', icon: '🔒', title: 'Sadece Bunlar', desc: 'Sıvı yağ/tuz hariç ekstra malzeme YOK.' },
            ].map((opt) => {
              const isSelected = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id as FilterOptions['mode'])}
                  className={`relative flex items-start p-4 text-left rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-eco-green/5 border-2 border-eco-green ring-1 ring-eco-green/20'
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-3xl mr-4 ${isSelected ? 'scale-110' : 'opacity-70'} transition-transform`}>
                    {opt.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-bold mb-1 ${isSelected ? 'text-eco-dark' : 'text-gray-900'}`}>
                      {opt.title}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed font-medium">
                      {opt.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-eco-green animate-fade-in">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Detailed Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dietary Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-lg mr-2">🥗</span> Diyet Tercihi
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Hepsi', 'Vegan', 'Vejetaryen', 'Glutensiz', 'Düşük Karbonhidrat'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDietary(opt)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                      dietary === opt
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-lg mr-2">⏱️</span> Zamanın Var mı?
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Farketmez', 'Pratik (15 dk)', 'Hızlı (30 dk)'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTime(opt)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                      time === opt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative group overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer ${
          isDragging 
            ? 'bg-eco-green/10 ring-4 ring-eco-green/30 scale-[1.01]' 
            : 'bg-white hover:shadow-2xl shadow-xl shadow-gray-200/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`absolute inset-0 border-2 border-dashed rounded-3xl transition-colors duration-300 pointer-events-none ${isDragging ? 'border-eco-green' : 'border-gray-300 group-hover:border-eco-green/60'}`}></div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="p-10 flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-eco-light to-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-eco-green">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Buzdolabının Fotoğrafını Çek
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            İçeride ne varsa göster, israf etmeden harika lezzetlere dönüştürelim.
          </p>
          
          <button className="px-8 py-3 bg-eco-green text-white rounded-full font-bold shadow-lg shadow-eco-green/30 hover:bg-eco-dark hover:shadow-xl transition-all hover:-translate-y-0.5">
            Fotoğraf Yükle veya Çek 📸
          </button>
        </div>
      </div>
    </div>
  );
};
