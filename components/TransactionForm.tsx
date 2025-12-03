import React, { useState, useMemo } from 'react';
import { InventoryItem, TransactionType } from '../types';
import { PackagePlus, PackageMinus, Save } from 'lucide-react';

interface TransactionFormProps {
  inventory: InventoryItem[];
  onSubmit: (itemId: string, type: TransactionType, amount: number, note: string) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ inventory, onSubmit }) => {
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number | string>('');
  const [type, setType] = useState<TransactionType>(TransactionType.INBOUND);
  const [amount, setAmount] = useState<number | ''>('');
  const [note, setNote] = useState<string>('');

  // Extract unique names
  const medicineNames = useMemo(() => {
    return Array.from(new Set(inventory.map(i => i.name)));
  }, [inventory]);

  // Filter available sizes based on selected name
  const availableSizes = useMemo(() => {
    if (!selectedName) return [];
    return inventory
      .filter(i => i.name === selectedName)
      .map(i => i.size)
      .sort((a, b) => a - b);
  }, [selectedName, inventory]);

  // Get current stock for selected item to validate outbound
  const selectedItem = useMemo(() => {
    if (!selectedName || !selectedSize) return null;
    return inventory.find(i => i.name === selectedName && i.size === Number(selectedSize));
  }, [selectedName, selectedSize, inventory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !amount || amount <= 0) return;
    
    // Logic check for outbound
    if (type === TransactionType.OUTBOUND && selectedItem.stock < Number(amount)) {
      alert(`庫存不足！目前 ${selectedItem.name} (${selectedItem.size}顆裝) 僅剩 ${selectedItem.stock}。`);
      return;
    }

    onSubmit(selectedItem.id, type, Number(amount), note);
    
    // Reset form partially
    setAmount('');
    setNote('');
    alert('異動紀錄已儲存');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        {type === TransactionType.INBOUND ? <PackagePlus className="text-teal-600"/> : <PackageMinus className="text-rose-500"/>}
        {type === TransactionType.INBOUND ? '進貨作業' : '出貨作業'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Transaction Type Toggle */}
        <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType(TransactionType.INBOUND)}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === TransactionType.INBOUND 
                ? 'bg-white text-teal-700 shadow ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            進貨 (Inbound)
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.OUTBOUND)}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === TransactionType.OUTBOUND 
                ? 'bg-white text-rose-600 shadow ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            出貨 (Outbound)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medicine Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">選擇藥品</label>
            <select
              required
              value={selectedName}
              onChange={(e) => {
                setSelectedName(e.target.value);
                setSelectedSize(''); // Reset size when name changes
              }}
              className="w-full rounded-lg border-slate-300 py-2.5 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            >
              <option value="">請選擇藥品名稱...</option>
              {medicineNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">選擇規格</label>
            <select
              required
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              disabled={!selectedName}
              className="w-full rounded-lg border-slate-300 py-2.5 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">請選擇規格...</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size} 顆裝</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            數量 
            {selectedItem && (
               <span className="ml-2 text-xs font-normal text-slate-500">
                 (目前庫存: {selectedItem.stock})
               </span>
            )}
          </label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="請輸入數量"
            className="w-full rounded-lg border-slate-300 py-2.5 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        {/* Note Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">備註 (選填)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：批號、客戶名稱..."
            className="w-full rounded-lg border-slate-300 py-2.5 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!selectedItem}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium shadow-sm transition-colors ${
              type === TransactionType.INBOUND 
                ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500' 
                : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save size={20} />
            <span>確認提交</span>
          </button>
        </div>

      </form>
    </div>
  );
};