import React, { useState } from 'react';
import { Header } from './components/Header';
import { VendorCard } from './components/VendorCard';
import { ChatInterface } from './components/ChatInterface';
import { VENDORS } from './constants';
import { Vendor } from './types';

const App: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleHomeClick = () => {
    setSelectedVendor(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Always show header, but adapt content based on state */}
      <Header onHome={handleHomeClick} showHome={!!selectedVendor} />

      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        {!selectedVendor ? (
          <div className="space-y-10 fade-in">
            <div className="text-center space-y-4 max-w-2xl mx-auto pt-10">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600">Sirion Agent</span>
              </h2>
              <p className="text-lg text-slate-500">
                Select a vendor to manage contracts, analyze spend, or consult with the AI agent regarding specific agreements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              {VENDORS.map((vendor) => (
                <VendorCard 
                  key={vendor.id} 
                  vendor={vendor} 
                  onClick={handleVendorClick} 
                />
              ))}
            </div>

            {/* Decorative visual for the dashboard */}
            <div className="mt-16 border-t border-slate-200 pt-8 text-center">
                <div className="inline-flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                        <span className="text-sm font-medium">Active Monitoring</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        <span className="text-sm font-medium">Risk Analysis</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                        <span className="text-sm font-medium">Spend Tracking</span>
                     </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChatInterface vendor={selectedVendor} onBack={handleHomeClick} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;