export enum AppMode {
  MANUAL = 'MANUAL',
  AI_ASSISTED = 'AI_ASSISTED'
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
}

export interface ProductData {
  name: string;
  sellingPrice: number;
  quantity: number;
  costs: CostItem[];
}

export interface AIContextData {
  businessType: string;
  location: string;
  targetAudience: string;
  season: string;
  quality: string;
}

export interface CalculationResult {
  totalCost: number;
  hppPerUnit: number;
  revenue: number;
  grossProfit: number;
  marginPercent: number;
}

export interface AIResponseData {
  rentang_harga_pasaran: {
    minimum: number;
    maksimum: number;
  };
  harga_rekomendasi: number;
  estimasi_margin_persen: number;
  analisis_singkat: string;
  peringatan: string;
  saran_strategi: string[];
}

export const BUSINESS_TYPES = [
  "Retail / Toko",
  "F&B (Makanan & Minuman)",
  "Jasa Professional",
  "Travel & Pariwisata",
  "Produk Digital",
  "Kerajinan / Manufaktur"
];

export const AUDIENCE_TYPES = [
  "Budget / Ekonomis",
  "Menengah / Standar",
  "Atas / Luxury",
  "Wisatawan Domestik",
  "Wisatawan Mancanegara",
  "Korporat / B2B"
];

export const SEASONS = [
  "Low Season",
  "Normal Season",
  "High Season / Liburan",
  "Peak Season"
];

export const QUALITIES = [
  "Ekonomis",
  "Standar",
  "Premium",
  "Luxury"
];