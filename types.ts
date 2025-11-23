
export interface Ingredient {
  name: string;
  amount?: string;
}

export interface FilterOptions {
  dietary: 'Hepsi' | 'Vegan' | 'Vejetaryen' | 'Glutensiz' | 'Düşük Karbonhidrat';
  time: 'Farketmez' | 'Pratik (15 dk)' | 'Hızlı (30 dk)';
  mode: 'Standart' | 'Öğrenci Evi' | 'Fit Yaşam' | 'Sadece Bunlar';
}

export interface Recipe {
  id: string;
  title: string;
  description: string; // Why this is economical/sustainable
  ingredients: string[];
  pantryItems: string[]; // Items assumed to be at home (salt, oil, etc.)
  missingIngredients: string[]; // Items needed to be bought
  instructions: string[];
  prepTime: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  sustainabilityScore: number; // 1-10
  calories?: string;
}

export interface AnalysisResult {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  FAVORITES = 'FAVORITES',
  ERROR = 'ERROR'
}