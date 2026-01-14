import React from 'react';
import { AIResponseData } from '../types';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';

interface AIRecommendationSectionProps {
  data: AIResponseData;
}

const AIRecommendationSection: React.FC<AIRecommendationSectionProps> = ({ data }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="text-yellow-300" />
          Rekomendasi AI Smart Pricing
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Price Recommendation */}
        <div className="text-center">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Harga Jual Rekomendasi</p>
          <div className="text-4xl font-bold text-white mb-2">
            {formatCurrency(data.harga_rekomendasi)}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm">
             <TrendingUp size={14} />
             <span>Potensi Margin: {data.estimasi_margin_persen.toFixed(1)}%</span>
          </div>
        </div>

        {/* Market Range */}
        <div className="bg-white/10 rounded-lg p-4 flex justify-between items-center text-sm">
           <div className="text-left">
              <span className="block text-indigo-200 text-xs">Pasar Minimum</span>
              <span className="font-semibold">{formatCurrency(data.rentang_harga_pasaran.minimum)}</span>
           </div>
           <div className="h-8 w-px bg-white/20"></div>
           <div className="text-right">
              <span className="block text-indigo-200 text-xs">Pasar Maksimum</span>
              <span className="font-semibold">{formatCurrency(data.rentang_harga_pasaran.maksimum)}</span>
           </div>
        </div>

        {/* Analysis Text */}
        <div className="space-y-4">
           <div className="flex gap-3 items-start">
              <Info className="text-indigo-300 shrink-0 mt-1" size={18} />
              <p className="text-indigo-50 text-sm leading-relaxed">
                {data.analisis_singkat}
              </p>
           </div>
           
           {data.peringatan && (
             <div className="flex gap-3 items-start bg-orange-500/20 p-3 rounded-lg border border-orange-500/30">
                <AlertTriangle className="text-orange-300 shrink-0 mt-1" size={18} />
                <p className="text-orange-100 text-sm font-medium">
                  {data.peringatan}
                </p>
             </div>
           )}
        </div>

        {/* Strategy List */}
        <div>
           <h4 className="font-semibold text-indigo-200 text-sm mb-3 uppercase">Strategi Disarankan</h4>
           <ul className="space-y-2">
              {data.saran_strategi.map((strategy, idx) => (
                <li key={idx} className="flex gap-2 items-start text-sm text-white/90">
                   <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={16} />
                   <span>{strategy}</span>
                </li>
              ))}
           </ul>
        </div>
        
        <div className="text-xs text-center text-indigo-300/60 mt-4 border-t border-white/10 pt-4">
          Disclaimer: Rekomendasi ini adalah estimasi AI berdasarkan logika pasar umum. Gunakan sebagai referensi, bukan patokan harga resmi.
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationSection;