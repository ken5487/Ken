import React, { useState, useMemo } from 'react';
import { TransactionRecord, TransactionType } from '../types';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Package,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface HistoryLogProps {
  logs: TransactionRecord[];
}

type SortKey = 'timestamp' | 'itemName';
type SortDirection = 'asc' | 'desc';
type FilterType = 'ALL' | 'INBOUND' | 'OUTBOUND';

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs }) => {
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const processedLogs = useMemo(() => {
    let result = [...logs];

    // Filter
    if (filterType !== 'ALL') {
      result = result.filter(log => log.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'timestamp') {
        comparison = a.timestamp - b.timestamp;
      } else if (sortKey === 'itemName') {
        comparison = a.itemName.localeCompare(b.itemName, 'zh-TW');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [logs, filterType, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      // Default to descending for dates (newest first), ascending for names
      setSortDirection(key === 'timestamp' ? 'desc' : 'asc');
    }
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ArrowUpRight className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">尚無異動紀錄</h3>
        <p className="mt-1 text-slate-500">所有的進貨與出貨紀錄將會顯示於此。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Filter Group */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-slate-500 text-sm font-medium mr-2">
            <Filter size={16} className="mr-1" />
            篩選
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === 'ALL' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType(TransactionType.INBOUND)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === TransactionType.INBOUND
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              進貨
            </button>
            <button
              onClick={() => setFilterType(TransactionType.OUTBOUND)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterType === TransactionType.OUTBOUND
                  ? 'bg-white text-rose-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              出貨
            </button>
          </div>
        </div>

        {/* Sort Group */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center text-slate-500 text-sm font-medium mr-2 whitespace-nowrap">
            <ArrowUpDown size={16} className="mr-1" />
            排序
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSort('timestamp')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                sortKey === 'timestamp'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar size={14} />
              日期
              {sortKey === 'timestamp' && (
                sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
              )}
            </button>
            <button
              onClick={() => handleSort('itemName')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                sortKey === 'itemName'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package size={14} />
              藥品
              {sortKey === 'itemName' && (
                sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group select-none" 
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    時間
                    {sortKey === 'timestamp' && (
                      <span className="text-blue-500">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">動作</th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group select-none" 
                  onClick={() => handleSort('itemName')}
                >
                  <div className="flex items-center gap-1">
                    藥品名稱
                    {sortKey === 'itemName' && (
                      <span className="text-blue-500">{sortDirection === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">規格</th>
                <th className="px-6 py-4 text-right">數量</th>
                <th className="px-6 py-4">備註</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedLogs.length > 0 ? (
                processedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {new Date(log.timestamp).toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {log.type === TransactionType.INBOUND ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                          <ArrowDownLeft size={12} /> 進貨
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">
                          <ArrowUpRight size={12} /> 出貨
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{log.itemName}</td>
                    <td className="px-6 py-4">{log.itemSize} 顆裝</td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      log.type === TransactionType.INBOUND ? 'text-teal-600' : 'text-rose-600'
                    }`}>
                      {log.type === TransactionType.INBOUND ? '+' : '-'}{log.amount}
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic">
                      {log.note || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                       <Filter size={24} className="opacity-20"/>
                       <span>沒有符合篩選條件的紀錄</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};