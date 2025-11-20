import React from 'react';

interface HeaderProps {
  onHome: () => void;
  showHome: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onHome, showHome }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={onHome}>
          {/* Simple Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              <span className="text-purple-700">Sirion</span>
              <span className="text-teal-600">Agent</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium -mt-1">Intelligent Contract Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {showHome && (
             <button 
               onClick={onHome}
               className="text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors"
             >
               Dashboard
             </button>
           )}
           <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
             JD
           </div>
        </div>
      </div>
    </header>
  );
};