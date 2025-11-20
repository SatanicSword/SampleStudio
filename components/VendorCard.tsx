import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Vendor, VendorStatus } from '../types';

interface VendorCardProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  const isRisk = vendor.status === VendorStatus.AT_RISK;

  return (
    <div 
      onClick={() => onClick(vendor)}
      className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isRisk ? 'bg-red-500' : 'bg-teal-500'} group-hover:h-1.5 transition-all`} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm ${isRisk ? 'bg-slate-800' : 'bg-slate-800'}`}>
             {vendor.logoInitials}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
              {vendor.name}
            </h3>
            <p className="text-xs text-slate-500">ID: {vendor.id.toUpperCase()}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          isRisk 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-teal-50 text-teal-700 border-teal-200'
        }`}>
          {vendor.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Value</p>
          <p className="text-slate-900 font-medium">{vendor.contractValue}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Renewal</p>
          <p className="text-slate-900 font-medium">{vendor.renewalDate}</p>
        </div>
      </div>

      <div className="h-24 -mx-2 mb-2">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vendor.spendData}>
              <defs>
                <linearGradient id={`colorSpend-${vendor.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isRisk ? '#ef4444' : '#0d9488'} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={isRisk ? '#ef4444' : '#0d9488'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#334155' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke={isRisk ? '#ef4444' : '#0d9488'} 
                fillOpacity={1} 
                fill={`url(#colorSpend-${vendor.id})`} 
                strokeWidth={2}
              />
            </AreaChart>
         </ResponsiveContainer>
      </div>
      <div className="flex justify-end items-center mt-2">
          <span className="text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform flex items-center">
            Manage Agent 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
      </div>
    </div>
  );
};