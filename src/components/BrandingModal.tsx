import React from 'react';
import { X, Sliders, Check, Type, Mail, Building2, Table } from 'lucide-react';
import { BrandingOptions } from '../types';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingOptions;
  onSaveBranding: (newBranding: BrandingOptions) => void;
}

export const BrandingModal: React.FC<BrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
}) => {
  const [formData, setFormData] = React.useState<BrandingOptions>(branding);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveBranding(formData);
    onClose();
  };

  const handleReset = () => {
    const defaults: BrandingOptions = {
      companyName: 'LegalEase Inc.',
      contactEmail: 'contact@legalease.com',
      showLogo: true,
      fontFamily: 'Times New Roman',
      includeTermsTable: true,
    };
    setFormData(defaults);
    onSaveBranding(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Branding & Export Settings
              </h3>
              <p className="text-xs text-slate-400">
                Customize headers, typography, and footer disclosures
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Company Name */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              Company / Law Firm Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="e.g. LegalEase Inc."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Embedded in DOCX headers and PDF title marks
            </span>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Contact Email / Footer Identity
            </label>
            <input
              type="text"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="e.g. contact@legalease.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Appears in document footer copyright notices
            </span>
          </div>

          {/* Typography */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              Document Typography
            </label>
            <select
              value={formData.fontFamily}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fontFamily: e.target.value as BrandingOptions['fontFamily'],
                })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm"
            >
              <option value="Times New Roman">Times New Roman (Standard Legal Font)</option>
              <option value="Georgia">Georgia (Modern Serif)</option>
              <option value="Arial">Arial (Clean Sans-Serif)</option>
              <option value="Courier New">Courier New (Monospaced Technical)</option>
            </select>
          </div>

          {/* Include Terms Table */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeTermsTable}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    includeTermsTable: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
              />
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-amber-400" />
                Auto-generate Terms Table in Word/DOCX and Preview
              </span>
            </label>
            <p className="text-[11px] text-slate-500 ml-6 mt-0.5">
              Parses semicolon clauses into an executive stipulations table
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
