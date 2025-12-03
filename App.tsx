import React, { useState } from 'react';
import { INITIAL_INVENTORY } from './constants';
import { InventoryItem, TransactionRecord, TransactionType, TabView } from './types';
import { TabNavigation } from './components/TabNavigation';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { HistoryLog } from './components/HistoryLog';
import { Pill } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [history, setHistory] = useState<TransactionRecord[]>([]);

  const handleUpdateSafetyStock = (id: string, newSafetyStock: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, safetyStock: newSafetyStock } : item
    ));
  };

  const handleTransaction = (itemId: string, type: TransactionType, amount: number, note: string) => {
    // 1. Update Inventory
    let processedItem: InventoryItem | undefined;

    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        processedItem = item;
        const newStock = type === TransactionType.INBOUND 
          ? item.stock + amount 
          : item.stock - amount;
        return { ...item, stock: newStock };
      }
      return item;
    }));

    // 2. Add History Record
    if (processedItem) {
      const newRecord: TransactionRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        itemName: processedItem.name,
        itemSize: processedItem.size,
        type,
        amount,
        note
      };
      setHistory(prev => [newRecord, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <Pill size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediStock Pro</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            智慧藥品庫存管理系統
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-slate-800">庫存總覽</h2>
                <span className="text-sm text-slate-500">
                  共 {inventory.length} 項藥品規格
                </span>
              </div>
              <Dashboard 
                inventory={inventory} 
                onUpdateSafetyStock={handleUpdateSafetyStock} 
              />
            </div>
          )}

          {activeTab === 'transaction' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-lg font-semibold text-slate-800">進出貨操作</h2>
                <p className="text-slate-500">請填寫下方表單以更新庫存</p>
              </div>
              <TransactionForm 
                inventory={inventory} 
                onSubmit={handleTransaction} 
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-slate-800">異動歷史紀錄</h2>
                <span className="text-sm text-slate-500">
                  依照時間倒序排列
                </span>
              </div>
              <HistoryLog logs={history} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}