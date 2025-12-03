import React, { useState, useEffect } from 'react';
import { INITIAL_INVENTORY } from './constants';
import { InventoryItem, TransactionRecord, TransactionType, TabView } from './types';
import { TabNavigation } from './components/TabNavigation';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { HistoryLog } from './components/HistoryLog';
import { Pill, Database, Loader2 } from 'lucide-react';

// Firebase Imports
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  runTransaction,
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Sync Inventory from Firestore
  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'), orderBy('size'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as InventoryItem);
      });
      
      setInventory(items);
      
      // Initial Data Seeding: If DB is empty, upload INITIAL_INVENTORY
      if (items.length === 0 && !loading) {
        seedInitialData();
      }
      
      if (loading) setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("無法連接資料庫，請檢查網路或 Firebase 設定。");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sync History from Firestore
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: TransactionRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as TransactionRecord);
      });
      setHistory(records);
    }, (err) => {
      console.error("History sync error:", err);
    });

    return () => unsubscribe();
  }, []);

  // Helper: Seed initial data if database is empty
  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);
      INITIAL_INVENTORY.forEach(item => {
        // Create a new reference with auto-generated ID
        const docRef = doc(collection(db, "inventory"));
        // Remove the local random ID, let Firestore generate one, or use the docRef.id
        const { id, ...data } = item; 
        batch.set(docRef, { ...data, stock: item.stock, safetyStock: item.safetyStock });
      });
      await batch.commit();
      console.log("Initial data seeded successfully");
    } catch (e) {
      console.error("Error seeding data: ", e);
    }
  };

  const handleUpdateSafetyStock = async (id: string, newSafetyStock: number) => {
    try {
      const itemRef = doc(db, 'inventory', id);
      await updateDoc(itemRef, { safetyStock: newSafetyStock });
    } catch (e) {
      console.error("Error updating safety stock:", e);
      alert("更新安全庫存失敗，請重試。");
    }
  };

  const handleTransaction = async (itemId: string, type: TransactionType, amount: number, note: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Get the current state of the item to ensure stock is accurate
        const itemRef = doc(db, 'inventory', itemId);
        const itemDoc = await transaction.get(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error("Item does not exist!");
        }

        const currentStock = itemDoc.data().stock;
        
        // Double check for outbound constraint in case another device updated it
        if (type === TransactionType.OUTBOUND && currentStock < amount) {
          throw new Error(`庫存不足！同步後發現庫存僅剩 ${currentStock}`);
        }

        const newStock = type === TransactionType.INBOUND 
          ? currentStock + amount 
          : currentStock - amount;

        // 2. Update Inventory Stock
        transaction.update(itemRef, { stock: newStock });

        // 3. Add Transaction Record
        const newRecordRef = doc(collection(db, 'transactions'));
        const newRecordData: Omit<TransactionRecord, 'id'> = {
          timestamp: Date.now(),
          itemName: itemDoc.data().name,
          itemSize: itemDoc.data().size,
          type,
          amount,
          note
        };
        transaction.set(newRecordRef, newRecordData);
      });
    } catch (e: any) {
      console.error("Transaction failed: ", e);
      alert(`交易失敗: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>正在連接雲端資料庫...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <Database className="text-rose-500 mb-4" size={48} />
        <h1 className="text-xl font-bold mb-2">連接失敗</h1>
        <p className="text-center text-slate-600 mb-4">{error}</p>
        <p className="text-sm text-slate-400">請確認 firebase.ts 中的設定是否正確</p>
      </div>
    );
  }

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
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              雲端同步中
            </span>
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
                <p className="text-slate-500">所有操作將即時同步至雲端</p>
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