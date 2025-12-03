export interface InventoryItem {
  id: string;
  name: string;
  size: number; // e.g., 7, 14, 21, 28
  stock: number;
  safetyStock: number;
}

export enum TransactionType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export interface TransactionRecord {
  id: string;
  timestamp: number; // Unix timestamp
  itemName: string;
  itemSize: number;
  type: TransactionType;
  amount: number;
  note: string;
}

export type TabView = 'dashboard' | 'transaction' | 'history' | 'admin';