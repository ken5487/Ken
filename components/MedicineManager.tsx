import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';

interface MedicineManagerProps {
  inventory: InventoryItem[];
}

export const MedicineManager: React.FC<MedicineManagerProps> = ({ inventory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [stock, setStock] = useState('');
  const [safetyStock, setSafetyStock] = useState('');

  const resetForm = () => {
    setName('');
    setSize('');
    setStock('');
    setSafetyStock('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setSize(item.size.toString());
    setStock(item.stock.toString());
    setSafetyStock(item.safetyStock.toString());
    setIsAdding(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'inventory'), {
        name,
        size: parseInt(size),
        stock: parseInt(stock),
        safetyStock: parseInt(safetyStock)
      });
      resetForm();
      alert('藥品已新增');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('新增失敗');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const itemRef = doc(db, 'inventory', editingId);
      await updateDoc(itemRef, {
        name,
        size: parseInt(size),
        stock: parseInt(stock),
        safetyStock: parseInt(safetyStock)
      });
      resetForm();
    } catch (error) {
      console.error("Error updating document: ", error);
      alert('更新失敗');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`確定要刪除 "${name}" 嗎？此動作無法復原。`)) {
      try {
        await deleteDoc(doc(db, 'inventory', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('刪除失敗');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">藥品資料庫管理</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            新增藥品
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            {isAdding ? '新增藥品項目' : '編輯藥品資訊'}
          </h3>
          <form onSubmit={isAdding ? handleAdd : handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">藥品名稱</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="例如：三黃錠"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">規格 (顆裝)</label>
              <input
                type="number"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="例如：14"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">目前庫存</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">安全庫存警示值</label>
              <input
                type="number"
                required
                min="0"
                value={safetyStock}
                onChange={(e) => setSafetyStock(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 shadow-sm"
              >
                <Save size={18} />
                儲存設定
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">藥品名稱</th>
              <th className="px-6 py-4">規格</th>
              <th className="px-6 py-4">庫存</th>
              <th className="px-6 py-4">安全庫存</th>
              <th className="px-6 py-4 text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4">{item.size} 顆裝</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4">{item.safetyStock}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="編輯"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="刪除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={24} />
                    <span>目前沒有藥品資料，請新增。</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};