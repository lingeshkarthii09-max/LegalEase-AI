import React from 'react';
import { Scale, Sparkles, Sliders, History, FileText, Bookmark } from 'lucide-react';
import { BrandingOptions } from '../types';

interface HeaderProps {
  branding: BrandingOptions;
  onOpenBranding: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onSelectScenarioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  onOpenBranding,
  onOpenHistory,
  historyCount,
  onSelectScenarioModal,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Scale className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                {branding.companyName}
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI Legal Document Generator • Instant DOCX, PDF & TXT
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectScenarioModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            Quick Scenarios
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            title="Saved Contracts"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Drafts</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 text-[10px] rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenBranding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            title="Branding & Export Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
