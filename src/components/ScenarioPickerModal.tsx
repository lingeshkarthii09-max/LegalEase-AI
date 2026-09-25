import React from 'react';
import { X, Bookmark, ArrowRight, Sparkles, Check } from 'lucide-react';
import { PREBUILT_SCENARIOS } from '../data/scenarios';
import { PrebuiltScenario } from '../types';

interface ScenarioPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: PrebuiltScenario) => void;
}

export const ScenarioPickerModal: React.FC<ScenarioPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Pre-configured Legal Scenarios
              </h3>
              <p className="text-xs text-slate-400">
                Instantly load official sample contracts from the LegalEase specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of scenarios */}
        <div className="p-5 overflow-y-auto space-y-3">
          {PREBUILT_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                onSelectScenario(sc);
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {sc.title}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {sc.badge}
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Load <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-2">{sc.subtitle}</p>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>
                  <strong className="text-slate-400">Parties:</strong> {sc.parties}
                </div>
                <div className="line-clamp-1">
                  <strong className="text-slate-400">Terms:</strong> {sc.terms}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
