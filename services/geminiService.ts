import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductData, AIContextData, CalculationResult, AIResponseData } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generatePricingAnalysis = async (
  product: ProductData,
  context: AIContextData,
  calc: CalculationResult
): Promise<AIResponseData> => {
  
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      rentang_harga_pasaran: {
        type: Type.OBJECT,
        properties: {
          minimum: { type: Type.NUMBER, description: "Harga terendah di pasar" },
          maksimum: { type: Type.NUMBER, description: "Harga tertinggi di pasar" },
        },
        required: ["minimum", "maksimum"],
      },
      harga_rekomendasi: {
        type: Type.NUMBER,
        description: "Satu angka harga jual yang direkomendasikan",
      },
      estimasi_margin_persen: {
        type: Type.NUMBER,
        description: "Persentase margin dari harga rekomendasi",
      },
      analisis_singkat: {
        type: Type.STRING,
        description: "Penjelasan logika harga dalam 2-3 kalimat",
      },
      peringatan: {
        type: Type.STRING,
        description: "Peringatan jika margin terlalu tipis atau harga tidak wajar",
      },
      saran_strategi: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "2-3 strategi singkat (bundling, promo, dll)",
      },
    },
    required: ["rentang_harga_pasaran", "harga_rekomendasi", "estimasi_margin_persen", "analisis_singkat", "peringatan", "saran_strategi"],
  };

  const prompt = `
    Bertindaklah sebagai Konsultan Bisnis Senior & Analis Harga di Indonesia.
    
    Analisis data produk berikut untuk memberikan rekomendasi harga jual:
    
    DATA PRODUK:
    - Nama Produk: ${product.name}
    - HPP (Biaya Modal): Rp ${calc.totalCost.toLocaleString('id-ID')}
    - Harga Jual Saat Ini (User): Rp ${product.sellingPrice.toLocaleString('id-ID')}
    - Margin Saat Ini: ${calc.marginPercent.toFixed(2)}%
    
    KONTEKS BISNIS:
    - Jenis Usaha: ${context.businessType}
    - Lokasi: ${context.location}
    - Target Pelanggan: ${context.targetAudience}
    - Musim: ${context.season}
    - Kualitas: ${context.quality}

    TUGAS:
    1. Estimasi harga pasar yang wajar di lokasi tersebut untuk target pelanggan tersebut.
    2. Berikan rekomendasi harga optimal yang menjamin profit sehat namun tetap kompetitif.
    3. Analisis apakah harga user saat ini kemahalan, kemurahan, atau pas.
    
    Gunakan logika bisnis yang kuat. Jangan mengarang data spesifik jika tidak tahu, gunakan estimasi range yang umum di industri tersebut.
    Berikan output JSON sesuai schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as AIResponseData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menganalisis harga. Silakan coba lagi.");
  }
};