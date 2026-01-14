import React from 'react';
import { CalculationResult } from '../types';
import { TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsSectionProps {
  results: CalculationResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isProfitable = results.grossProfit >= 0;
  
  // Data for Chart
  const chartData = [
    { name: 'Total Biaya (HPP)', value: results.totalCost },
    { name: 'Estimasi Laba', value: results.grossProfit > 0 ? results.grossProfit : 0 },
  ];
  
  const COLORS = ['#94a3b8', isProfitable ? '#22c55e' : '#ef4444'];

  const getMarginColor = (margin: number) => {
    if (margin < 0) return 'text-red-600 bg-red-50';
    if (margin < 15) return 'text-orange-600 bg-orange-50';
    if (margin < 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const marginClass = getMarginColor(results.marginPercent);

  if (results.totalCost === 0) {
      return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
              <div className="mb-2">
                 <Wallet size={48} className="mx-auto text-slate-300" />
              </div>
              <p>Masukkan komponen biaya untuk melihat hasil perhitungan.</p>
          </div>
      )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">
        Analisis Keuangan
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">HPP Per Unit</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(results.hppPerUnit)}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Total HPP (Modal)</p>
          <p className="text-xl font-bold text-slate-700">{formatCurrency(results.totalCost)}</p>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase mb-1">Potensi Omzet</p>
          <p className="text-xl font-bold text-blue-800">{formatCurrency(results.revenue)}</p>
        </div>

        <div className={`p-4 rounded-lg border ${isProfitable ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className="flex justify-between items-start">
            <div>
                <p className={`text-xs font-medium uppercase mb-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfitable ? 'Estimasi Laba' : 'Potensi Rugi'}
                </p>
                <p className={`text-xl font-bold ${isProfitable ? 'text-green-800' : 'text-red-800'}`}>
                    {formatCurrency(results.grossProfit)}
                </p>
            </div>
            {isProfitable ? <TrendingUp size={20} className="text-green-600"/> : <TrendingDown size={20} className="text-red-600"/>}
          </div>
        </div>
      </div>

      {/* Margin Indicator */}
      <div className={`p-4 rounded-lg flex items-center justify-between ${marginClass}`}>
          <div className="flex items-center gap-2">
            <Percent size={18} />
            <span className="font-medium">Margin Keuntungan</span>
          </div>
          <span className="text-2xl font-bold">{results.marginPercent.toFixed(1)}%</span>
      </div>

      {/* Chart */}
      <div className="h-64 w-full mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <p className="text-xs text-slate-400 font-medium">Breakdown</p>
          </div>
      </div>
    </div>
  );
};

export default ResultsSection;