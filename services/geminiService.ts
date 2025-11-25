import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, AnalysisResult, FilterOptions } from "../types";

// Lazy initialization to prevent top-level errors
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    // We use a fallback empty string to prevent constructor crash, 
    // but the API call will fail gracefully in the try-catch block if key is missing.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    detectedIngredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ingredients detected in the image (e.g., yogurt, zucchini, carrots).",
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING, description: "A catchy Turkish name for the dish." },
          description: { type: Type.STRING, description: "Brief explanation emphasizing why this prevents waste or saves money." },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ingredients from the photo used." },
          pantryItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common household items needed (oil, salt, flour, etc.)." },
          missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ingredients NOT in the photo but required. Keep empty if 100% strictly from fridge, but populate for 'suggestion' recipes." },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step cooking instructions." },
          prepTime: { type: Type.STRING, description: "Estimated time (e.g., '15 dk', '30 dk')." },
          difficulty: { type: Type.STRING, enum: ["Kolay", "Orta", "Zor"] },
          sustainabilityScore: { type: Type.NUMBER, description: "Score from 1-10 on how much waste this prevents." },
          calories: { type: Type.STRING, description: "Approximate calories per serving (e.g. '350 kcal')." }
        },
        required: ["title", "ingredients", "instructions", "difficulty", "sustainabilityScore", "missingIngredients"]
      }
    }
  },
  required: ["detectedIngredients", "recipes"]
};

export const analyzeFridgeImage = async (base64Image: string, filters: FilterOptions): Promise<AnalysisResult> => {
  try {
    const client = getAiClient();
    
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    let filterPrompt = "";
    if (filters.dietary !== 'Hepsi') {
      filterPrompt += `Diyet Tercihi: Kesinlikle ${filters.dietary} olmalı. `;
    }
    if (filters.time !== 'Farketmez') {
      filterPrompt += `Zaman Kısıtlaması: Hazırlama ve pişirme süresi ${filters.time} seçeneğine uygun olmalı. `;
    }

    // Mode Specific Prompts
    let modeInstruction = "";
    switch (filters.mode) {
      case 'Öğrenci Evi':
        modeInstruction = "Öğrenci Evi Modu: Tarifler minimum bulaşık çıkaracak (tek tencere/tava/tepsi) ve en ucuz şekilde hazırlanacak biçimde olsun. Fırın kullanımı yerine ocak tercih edilebilir.";
        break;
      case 'Fit Yaşam':
        modeInstruction = "Fit/Sağlıklı Yaşam Modu: Tariflerin kalori değerlerini kesinlikle tahmin et ve yaz. Protein odaklı, sağlıklı yağlar içeren ve düşük karbonhidratlı seçenekler sun. Kızartma önerilmemeli.";
        break;
      case 'Sadece Bunlar':
        modeInstruction = "Sadece Bunlar Var Modu (Strict Mode): Evde temel malzemeler (sadece sıvı yağ, tuz, karabiber) dışında HİÇBİR EKSTRA malzeme olmadığını varsay. Sadece fotoğrafta gördüklerini kullanarak bir şeyler üret. 'pantryItems' listesinde sadece yağ/tuz/su olabilir, başka bir şey olamaz.";
        break;
      case 'Standart':
      default:
        modeInstruction = "Standart Mod: Dengeli, ekonomik ve lezzetli tarifler öner. Evde temel un, şeker, salça, baharat vb. olduğu varsayılabilir.";
        break;
    }

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `
              Sen uzman bir şef ve sürdürülebilirlik danışmanısın.
              Görevin bu buzdolabı fotoğrafını analiz etmek ve görünen malzemeleri kullanarak tarifler oluşturmak.
              
              Kullanıcı Tercihleri:
              ${filterPrompt}

              Seçilen Mod ve Özel Talimatlar:
              ${modeInstruction}

              Amacımız:
              1. Gıda israfını önlemek.
              2. Ekonomik olmak.
              
              Lütfen yanıtı Türkçe olarak ver ve JSON formatında olsun.
              En az 3, en fazla 5 tarif öner.
              
              Tarif Stratejisi:
              - 'Sadece Bunlar' modu seçili DEĞİLSE, 1-2 tarif için "Eksik Listesi" (missingIngredients) özelliği kullan: "Eğer şundan 1 tane alırsan bu harika yemeği yapabilirsin" gibi öneriler sun.
              - Eğer 'Sadece Bunlar' modu seçiliyse, missingIngredients kesinlikle boş olmalı.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.4
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // User friendly error message
    throw new Error(error.message || "Görüntü analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};