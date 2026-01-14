import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { CostItem, ProductData } from '../types';

interface InputSectionProps {
  data: ProductData;
  onChange: (data: ProductData) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ data, onChange }) => {
  const handleBasicChange = (field: keyof ProductData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const addCostItem = () => {
    const newCost: CostItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    };
    onChange({ ...data, costs: [...data.costs, newCost] });
  };

  const updateCostItem = (id: string, field: keyof CostItem, value: string | number) => {
    const newCosts = data.costs.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    onChange({ ...data, costs: newCosts });
  };

  const removeCostItem = (id: string) => {
    onChange({ ...data, costs: data.costs.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
        Informasi Dasar Produk
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nama Produk / Layanan</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Contoh: Paket Wisata Bali 3D2N"
            value={data.name}
            onChange={(e) => handleBasicChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Jumlah Unit (Qty)</label>
          <input
            type="number"
            min="1"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={data.quantity}
            onChange={(e) => handleBasicChange('quantity', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Rencana Harga Jual (Per Unit)</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-slate-400">Rp</span>
          <input
            type="number"
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
            value={data.sellingPrice || ''}
            onChange={(e) => handleBasicChange('sellingPrice', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-slate-700">Komponen Biaya (HPP)</h4>
          <button
            onClick={addCostItem}
            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-blue-50 rounded-lg transition"
          >
            <Plus size={16} /> Tambah Biaya
          </button>
        </div>

        {data.costs.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500 text-sm">
            Belum ada komponen biaya. Klik "Tambah Biaya" untuk mulai.
          </div>
        ) : (
          <div className="space-y-3">
            {data.costs.map((cost) => (
              <div key={cost.id} className="flex gap-3 items-start animate-fade-in">
                <input
                  type="text"
                  placeholder="Nama Biaya (misal: Bahan Baku)"
                  className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                  value={cost.name}
                  onChange={(e) => updateCostItem(cost.id, 'name', e.target.value)}
                />
                <div className="relative w-32 md:w-40">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                    value={cost.amount || ''}
                    onChange={(e) => updateCostItem(cost.id, 'amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button
                  onClick={() => removeCostItem(cost.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
           <AlertCircle size={14} />
           <span>Total HPP dihitung otomatis dari komponen biaya di atas.</span>
        </div>
      </div>
    </div>
  );
};

export default InputSection;