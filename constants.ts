import { InventoryItem } from './types';

// Helper to generate temporary IDs for the constant list
// These IDs will be replaced by Firestore IDs upon insertion
const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_INVENTORY: InventoryItem[] = [
  // 三黃錠
  { id: generateId(), name: '三黃錠', size: 14, stock: 5, safetyStock: 10 },
  { id: generateId(), name: '三黃錠', size: 21, stock: 10, safetyStock: 15 },
  // 冬蟲夏草
  { id: generateId(), name: '冬蟲夏草', size: 7, stock: 5, safetyStock: 10 },
  { id: generateId(), name: '冬蟲夏草', size: 14, stock: 10, safetyStock: 15 },
  { id: generateId(), name: '冬蟲夏草', size: 28, stock: 10, safetyStock: 20 },
  // 好睡寶
  { id: generateId(), name: '好睡寶', size: 7, stock: 0, safetyStock: 10 },
  { id: generateId(), name: '好睡寶', size: 14, stock: 0, safetyStock: 15 },
  { id: generateId(), name: '好睡寶', size: 28, stock: 0, safetyStock: 20 },
  // 夜好眠
  { id: generateId(), name: '夜好眠', size: 7, stock: 20, safetyStock: 15 },
  { id: generateId(), name: '夜好眠', size: 14, stock: 19, safetyStock: 20 },
  { id: generateId(), name: '夜好眠', size: 28, stock: 10, safetyStock: 25 },
  // 易纖速
  { id: generateId(), name: '易纖速', size: 7, stock: 5, safetyStock: 10 },
  { id: generateId(), name: '易纖速', size: 14, stock: 10, safetyStock: 20 },
  { id: generateId(), name: '易纖速', size: 28, stock: 40, safetyStock: 30 },
  // 紅景天
  { id: generateId(), name: '紅景天', size: 7, stock: 10, safetyStock: 10 },
  { id: generateId(), name: '紅景天', size: 14, stock: 15, safetyStock: 20 },
  // 紅麴丹參
  { id: generateId(), name: '紅麴丹參', size: 7, stock: 6, safetyStock: 10 },
  { id: generateId(), name: '紅麴丹參', size: 14, stock: 47, safetyStock: 30 },
  { id: generateId(), name: '紅麴丹參', size: 28, stock: 20, safetyStock: 20 },
  // 黃金異黃酮
  { id: generateId(), name: '黃金異黃酮', size: 7, stock: 25, safetyStock: 20 },
  // 複方丹參錠
  { id: generateId(), name: '複方丹參錠', size: 7, stock: 5, safetyStock: 10 },
  { id: generateId(), name: '複方丹參錠', size: 14, stock: 30, safetyStock: 20 },
  { id: generateId(), name: '複方丹參錠', size: 21, stock: 25, safetyStock: 20 },
  { id: generateId(), name: '複方丹參錠', size: 28, stock: 20, safetyStock: 20 },
];

export const MEDICINE_NAMES = Array.from(new Set(INITIAL_INVENTORY.map(i => i.name)));