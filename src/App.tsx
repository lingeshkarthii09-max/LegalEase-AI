/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DocumentForm } from './components/DocumentForm';
import { DocumentViewer } from './components/DocumentViewer';
import { ScenarioPickerModal } from './components/ScenarioPickerModal';
import { BrandingModal } from './components/BrandingModal';
import { HistoryModal, SavedDraft } from './components/HistoryModal';
import { DocumentRequest, DocumentAnalysis, BrandingOptions, PrebuiltScenario } from './types';
import { PREBUILT_SCENARIOS } from './data/scenarios';
import { Scale, FileText, ArrowRight, Sparkles, Shield, Bookmark, CheckCircle2 } from 'lucide-react';

const DEFAULT_BRANDING: BrandingOptions = {
  companyName: 'LegalEase Inc.',
  contactEmail: 'contact@legalease.com',
  showLogo: true,
  fontFamily: 'Times New Roman',
  includeTermsTable: true,
};

export default function App() {
  // Form State initialized to the standard Freelance Work Contract from the specification demo
  const [formData, setFormData] = useState<DocumentRequest>({
    document_type: PREBUILT_SCENARIOS[0].docType,
    parties: PREBUILT_SCENARIOS[0].parties,
    terms: PREBUILT_SCENARIOS[0].terms,
    dates: PREBUILT_SCENARIOS[0].date,
    governing_law: PREBUILT_SCENARIOS[0].governingLaw,
    tone: 'standard professional',
  });

  const [documentText, setDocumentText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Branding
  const [branding, setBranding] = useState<BrandingOptions>(() => {
    const saved = localStorage.getItem('legalease_branding');
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });

  // Saved Drafts
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => {
    const saved = localStorage.getItem('legalease_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('legalease_branding', JSON.stringify(branding));
  }, [branding]);

  useEffect(() => {
    localStorage.setItem('legalease_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleFormChange = (data: Partial<DocumentRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setErrorMsg(null);
  };

  const handleSelectScenario = (sc: PrebuiltScenario) => {
    setFormData({
      document_type: sc.docType,
      parties: sc.parties,
      terms: sc.terms,
      dates: sc.date,
      governing_law: sc.governingLaw,
      tone: 'standard professional',
    });
    setErrorMsg(null);
  };

  // Activity 2.2 / 4.2: POST /api/generate
  const handleGenerate = async () => {
    if (!formData.document_type || !formData.parties) {
      setErrorMsg('Please specify Document Type and Involved Parties.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.document) {
        throw new Error(data.error || 'Failed to generate legal document');
      }

      setDocumentText(data.document);

      // Save to drafts history
      const newDraft: SavedDraft = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        documentType: formData.document_type,
        parties: formData.parties,
        terms: formData.terms,
        dates: formData.dates,
        content: data.document,
      };
      setDrafts((prev) => [newDraft, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Error occurred while generating document.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plain English Analysis
  const handleRunAnalysis = async () => {
    if (!documentText) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: documentText,
          document_type: formData.document_type,
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.warn('Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadDraft = (draft: SavedDraft) => {
    setFormData({
      document_type: draft.documentType,
      parties: draft.parties,
      terms: draft.terms,
      dates: draft.dates,
      governing_law: 'State of California',
      tone: 'standard professional',
    });
    setDocumentText(draft.content);
    setAnalysis(null);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllDrafts = () => {
    setDrafts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        branding={branding}
        onOpenBranding={() => setIsBrandingModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        historyCount={drafts.length}
        onSelectScenarioModal={() => setIsScenarioModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Subheader Title & Branding presentation matching specification */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
          <div className="inline-flex items-center justify-center gap-2 p-2 px-3 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-1">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>AI Legal Document Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
            Draft, Edit & Export Legal Contracts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Powered by Generative AI with formatting standards, embedded branding, and direct export to Word (.docx), PDF & Text.
          </p>
        </div>

        {/* Quick Scenario Pills Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Featured Scenarios:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 flex-1 justify-start sm:justify-end">
            {PREBUILT_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`text-xs px-3 py-1 rounded-xl transition-all border flex items-center gap-1.5 ${
                  formData.document_type === sc.docType
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                <span>{sc.title}</span>
                <span className="text-[10px] text-slate-400 bg-slate-900/60 px-1.5 py-0.2 rounded">
                  {sc.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-white text-xs underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <DocumentForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />

            {/* Feature Highlights Card */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                LegalEase Standard Features
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Auto-formatted Term Tables
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Word (.DOCX) with Logo
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Branded Multi-page PDF
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Plain-English Risk Scan
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Document Output & Interaction (7 cols on lg) */}
          <div className="lg:col-span-7">
            {documentText ? (
              <DocumentViewer
                documentText={documentText}
                documentType={formData.document_type}
                termsInput={formData.terms}
                partiesInput={formData.parties}
                datesInput={formData.dates}
                branding={branding}
                onUpdateDocumentText={setDocumentText}
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                onRunAnalysis={handleRunAnalysis}
              />
            ) : (
              /* Initial Empty State matching specification page 18-19 ("Click 'Generate Document' to start") */
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[520px] space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner text-amber-400">
                  <Scale className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-bold text-white">
                    No Document Generated Yet
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select a scenario or fill out the form on the left, then click{' '}
                    <strong className="text-amber-400">
                      &apos;Generate Document&apos;
                    </strong>{' '}
                    to draft your structured legal agreement.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Freelance Contract Demo</span>
                  </button>
                </div>

                {/* Helpful guidance banner matching PDF */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-500 max-w-sm mt-4">
                  💡 Hint: Semicolons (<code className="text-amber-400">;</code>) in Terms & Conditions create distinct contractual clauses and term table rows.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {branding.companyName} • AI-Powered Legal Document Generator
          </div>
          <div className="text-[11px] text-slate-500">
            Export formats: .DOCX (Microsoft Word), .PDF (Branded Print), .TXT (Plain Text)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScenarioPickerModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      <BrandingModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        branding={branding}
        onSaveBranding={setBranding}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        onClearAll={handleClearAllDrafts}
      />
    </div>
  );
}
