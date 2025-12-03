import React from 'react';
import { InventoryItem } from '../types';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  onUpdateSafetyStock: (id: string, newSafetyStock: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, onUpdateSafetyStock }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">藥品名稱</th>
              <th className="px-6 py-4">規格</th>
              <th className="px-6 py-4 text-center">目前庫存量</th>
              <th className="px-6 py-4 text-center">推薦安全庫存量</th>
              <th className="px-6 py-4 text-center">建議補貨量</th>
              <th className="px-6 py-4 text-center">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => {
              const restockAmount = Math.max(0, item.safetyStock - item.stock);
              const isLowStock = item.stock < item.safetyStock;

              return (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50 transition-colors ${isLowStock ? 'bg-red-50/50' : ''}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {item.size} 顆裝
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-center font-bold ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      value={item.safetyStock}
                      onChange={(e) => onUpdateSafetyStock(item.id, parseInt(e.target.value) || 0)}
                      className="w-20 rounded-md border-0 py-1.5 pl-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 text-center shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                     {restockAmount > 0 ? (
                       <span className="text-red-600 font-bold flex items-center justify-center gap-1">
                          +{restockAmount}
                       </span>
                     ) : (
                       <span className="text-slate-400">-</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isLowStock ? (
                      <div className="flex items-center justify-center text-red-600 gap-1" title="庫存不足">
                        <AlertTriangle size={18} />
                        <span className="text-xs font-semibold">補貨</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-emerald-600 gap-1" title="庫存充足">
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-semibold">充足</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {inventory.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          暫無庫存資料
        </div>
      )}
    </div>
  );
};