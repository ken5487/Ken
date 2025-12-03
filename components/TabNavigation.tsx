import React from 'react';
import { TabView } from '../types';
import { LayoutDashboard, ArrowRightLeft, History } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: '庫存總覽與建議', icon: LayoutDashboard },
    { id: 'transaction', label: '進出貨操作區', icon: ArrowRightLeft },
    { id: 'history', label: '異動紀錄', icon: History },
  ];

  return (
    <div className="flex space-x-1 rounded-xl bg-slate-200/50 p-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              w-full flex items-center justify-center space-x-2 rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2
              ${isActive
                ? 'bg-white text-teal-700 shadow'
                : 'text-slate-600 hover:bg-white/[0.12] hover:text-slate-800'
              }
            `}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};