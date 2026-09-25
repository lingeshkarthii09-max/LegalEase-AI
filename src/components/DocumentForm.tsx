import React, { useState } from 'react';
import {
  FileText,
  Users,
  ListPlus,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { DocumentRequest } from '../types';
import { COMMON_CLAUSE_PRESETS, POPULAR_DOC_TYPES } from '../data/scenarios';

interface DocumentFormProps {
  formData: DocumentRequest;
  onChange: (data: Partial<DocumentRequest>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddClause = (clause: string) => {
    const current = formData.terms.trim();
    if (!current) {
      onChange({ terms: clause });
    } else if (current.endsWith(';')) {
      onChange({ terms: `${current} ${clause}` });
    } else {
      onChange({ terms: `${current}; ${clause}` });
    }
  };

  const handleSetToday = () => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    onChange({ dates: today });
  };

  const handleApplyPartiesPreset = (preset: string) => {
    onChange({ parties: preset });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-5 sm:p-6 space-y-5">
        {/* Document Type */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Document Type
            </label>
            <span className="text-[11px] text-slate-500">
              Contract, Agreement, NDA, Lease
            </span>
          </div>

          <input
            type="text"
            value={formData.document_type}
            onChange={(e) => onChange({ document_type: e.target.value })}
            placeholder="Document Type (Ex. Agreement, Contract, NDA)"
            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
          />

          {/* Quick pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {POPULAR_DOC_TYPES.slice(0, 5).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ document_type: type })}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors border ${
                  formData.document_type === type
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Parties Involved */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Parties Involved
            </label>
            <span className="text-[11px] text-slate-500">
              Names and legal roles
            </span>
          </div>

          <textarea
            rows={2}
            value={formData.parties}
            onChange={(e) => onChange({ parties: e.target.value })}
            placeholder="Jane Doe (Service Provider), TechNova Inc. (Client)"
            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans resize-none"
          />

          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Quick roles:</span>
            <button
              type="button"
              onClick={() =>
                handleApplyPartiesPreset(
                  'Jane Doe (Service Provider), TechNova Inc. (Client)'
                )
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Freelancer & Client
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPartiesPreset(
                  'Alice Smith (Tenant), XYZ Realty LLC (Landlord)'
                )
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Tenant & Landlord
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPartiesPreset(
                  'Apex Innovations LLC (Employer), Marcus Vance (Employee)'
                )
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Employer & Employee
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ListPlus className="w-3.5 h-3.5 text-amber-400" />
              Terms & Conditions{' '}
              <span className="text-amber-400 font-normal lowercase">
                (use semicolons for bullet points)
              </span>
            </label>
            <span className="text-[11px] text-slate-500">
              Clauses & covenants
            </span>
          </div>

          <textarea
            rows={4}
            value={formData.terms}
            onChange={(e) => onChange({ terms: e.target.value })}
            placeholder="Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice"
            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
          />

          {/* Quick clause inserts */}
          <div className="mt-2.5">
            <p className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
              <PlusCircle className="w-3 h-3 text-amber-400" />
              Click to insert standard clauses:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CLAUSE_PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAddClause(preset.clause)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-left"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Effective Date */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Effective Date
            </label>
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Clock className="w-3 h-3" /> Set Today
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={formData.dates}
              onChange={(e) => onChange({ dates: e.target.value })}
              placeholder="e.g. April 15, 2025"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
            />
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Governing Law & Legal Style Options
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Governing Law / Jurisdiction
                </label>
                <select
                  value={formData.governing_law || 'State of California'}
                  onChange={(e) => onChange({ governing_law: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="State of California">State of California</option>
                  <option value="State of Delaware">State of Delaware</option>
                  <option value="State of New York">State of New York</option>
                  <option value="State of Texas">State of Texas</option>
                  <option value="State of Florida">State of Florida</option>
                  <option value="State of Illinois">State of Illinois</option>
                  <option value="United Kingdom">United Kingdom (England & Wales)</option>
                  <option value="Canada (Ontario)">Canada (Ontario)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Drafting Tone
                </label>
                <select
                  value={formData.tone || 'standard professional'}
                  onChange={(e) => onChange({ tone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="standard professional">
                    Standard Professional Legal
                  </option>
                  <option value="strict protectionist">
                    Strict & Robust Protection
                  </option>
                  <option value="plain english & friendly">
                    Plain-Language Friendly
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !formData.document_type || !formData.parties}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Drafting Legal Document with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Generate Document</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Click &apos;Generate Document&apos; to create your customized legal contract.
          </p>
        </div>
      </div>
    </div>
  );
};
