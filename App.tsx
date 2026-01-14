import React, { useState, useMemo } from 'react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AppMode, ProductData, AIContextData, CalculationResult, AIResponseData, BUSINESS_TYPES, AUDIENCE_TYPES, SEASONS, QUALITIES } from './types';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AIContextSection from './components/AIContextSection';
import AIRecommendationSection from './components/AIRecommendationSection';
import { generatePricingAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.MANUAL);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [productData, setProductData] = useState<ProductData>({
    name: '',
    sellingPrice: 0,
    quantity: 1,
    costs: []
  });

  const [aiContext, setAiContext] = useState<AIContextData>({
    businessType: BUSINESS_TYPES[0],
    location: '',
    targetAudience: AUDIENCE_TYPES[0],
    season: SEASONS[1],
    quality: QUALITIES[1],
  });

  // Calculate metrics automatically whenever inputs change
  const results: CalculationResult = useMemo(() => {
    const totalCost = productData.costs.reduce((sum, item) => sum + item.amount, 0) * productData.quantity;
    const revenue = productData.sellingPrice * productData.quantity;
    const grossProfit = revenue - totalCost;
    
    // HPP Per unit
    const hppPerUnit = productData.quantity > 0 ? totalCost / productData.quantity : 0;
    
    // Margin percent
    const marginPercent = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    return {
      totalCost,
      hppPerUnit,
      revenue,
      grossProfit,
      marginPercent
    };
  }, [productData]);

  const handleAnalyze = async () => {
    if (!productData.name) {
      setError("Mohon isi nama produk terlebih dahulu.");
      return;
    }
    if (results.totalCost === 0) {
      setError("Mohon isi komponen biaya (HPP) terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const analysis = await generatePricingAnalysis(productData, aiContext, results);
      setAiResult(analysis);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <img 
               src="https://dixra.my.id/assets/dixra.png" 
               alt="Logo"
               className="w-10 h-10 rounded-xl shadow-lg shadow-blue-600/20 object-contain"
             />
             <div>
               <h1 className="text-xl font-bold text-slate-900">Kalkulator HPP & Smart Pricing</h1>
               <p className="text-xs text-slate-500 font-medium">Hitung Biaya • Cek Margin • Rekomendasi AI</p>
             </div>
           </div>

           {/* Mode Switcher */}
           <div className="bg-slate-100 p-1 rounded-lg flex items-center">
             <button
               onClick={() => setMode(AppMode.MANUAL)}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                 mode === AppMode.MANUAL 
                 ? 'bg-white text-slate-800 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               Mode Manual
             </button>
             <button
               onClick={() => setMode(AppMode.AI_ASSISTED)}
               className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                 mode === AppMode.AI_ASSISTED 
                 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                 : 'text-slate-500 hover:text-indigo-600'
               }`}
             >
               <Sparkles size={16} />
               AI Smart Mode
             </button>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-2 space-y-6">
             {/* Product Inputs */}
             <InputSection data={productData} onChange={setProductData} />

             {/* AI Context Inputs (Only in AI Mode) */}
             {mode === AppMode.AI_ASSISTED && (
               <div className="animate-fade-in">
                 <AIContextSection data={aiContext} onChange={setAiContext} />
                 
                 <div className="mt-6">
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    )}
                    
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          Menganalisis Pasar...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Analisis Harga dengan AI
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2">
                      AI akan menganalisis HPP, lokasi, dan target pasar Anda.
                    </p>
                 </div>
               </div>
             )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ResultsSection results={results} />
              
              {mode === AppMode.AI_ASSISTED && aiResult && (
                <div className="animate-fade-in-up">
                   <AIRecommendationSection data={aiResult} />
                </div>
              )}

              {mode === AppMode.AI_ASSISTED && !aiResult && !loading && (
                 <div className="bg-indigo-50 border border-indigo-100 border-dashed rounded-xl p-6 text-center text-indigo-400 animate-fade-in">
                    <Sparkles className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm">Isi data dan klik "Analisis Harga" untuk melihat rekomendasi AI.</p>
                 </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;