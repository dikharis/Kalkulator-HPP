import React from 'react';
import { Sparkles } from 'lucide-react';
import { AIContextData, BUSINESS_TYPES, AUDIENCE_TYPES, SEASONS, QUALITIES } from '../types';

interface AIContextSectionProps {
  data: AIContextData;
  onChange: (data: AIContextData) => void;
}

const AIContextSection: React.FC<AIContextSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof AIContextData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={100} className="text-indigo-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2 relative z-10">
        <Sparkles className="text-indigo-600" size={20} />
        Konteks Pasar (Untuk AI)
      </h3>
      
      <p className="text-sm text-indigo-700/80 relative z-10">
        Data ini membantu AI memberikan rekomendasi harga yang relevan dengan kondisi bisnis Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Jenis Usaha</label>
          <select
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={data.businessType}
            onChange={(e) => handleChange('businessType', e.target.value)}
          >
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Lokasi Pasar</label>
          <input
            type="text"
            placeholder="Contoh: Ubud, Bali"
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Target Pelanggan</label>
          <select
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={data.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
          >
            {AUDIENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Musim / Waktu</label>
          <select
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={data.season}
            onChange={(e) => handleChange('season', e.target.value)}
          >
            {SEASONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-indigo-900 mb-1">Kualitas Layanan/Produk</label>
          <select
            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={data.quality}
            onChange={(e) => handleChange('quality', e.target.value)}
          >
             {QUALITIES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AIContextSection;