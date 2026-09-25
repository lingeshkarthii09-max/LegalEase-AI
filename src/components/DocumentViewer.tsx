import React, { useState } from 'react';
import {
  Download,
  Edit3,
  CheckCircle2,
  Copy,
  Printer,
  FileText,
  FileCheck,
  Eye,
  Check,
  BookOpen,
  Scale,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BrandingOptions, DocumentAnalysis } from '../types';
import { exportToDocx } from '../utils/docxExport';
import { exportToPdf } from '../utils/pdfExport';
import { exportToTxt } from '../utils/txtExport';

interface DocumentViewerProps {
  documentText: string;
  documentType: string;
  termsInput: string;
  partiesInput: string;
  datesInput: string;
  branding: BrandingOptions;
  onUpdateDocumentText: (newText: string) => void;
  analysis: DocumentAnalysis | null;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentText,
  documentType,
  termsInput,
  partiesInput,
  datesInput,
  branding,
  onUpdateDocumentText,
  analysis,
  isAnalyzing,
  onRunAnalysis,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(documentText);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'intelligence'>('preview');

  // Keep editText in sync when parent text changes
  React.useEffect(() => {
    setEditText(documentText);
  }, [documentText]);

  const handleApplyEdit = () => {
    onUpdateDocumentText(editText);
    setIsEditing(false);
    setActiveTab('preview');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    exportToTxt(documentText, documentType);
  };

  const handleDownloadDocx = async () => {
    await exportToDocx(documentText, documentType, termsInput, branding);
  };

  const handleDownloadPdf = () => {
    exportToPdf(documentText, documentType, branding);
  };

  // Parse terms from semicolon input
  const termsList = termsInput
    .split(';')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Success Notification Banner (matching PDF page 20) */}
      <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl px-4 py-3 flex items-center justify-between text-emerald-200 shadow-lg shadow-emerald-950/30">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold tracking-wide">
            Document Generated Successfully!
          </span>
        </div>
        <span className="text-xs text-emerald-400/80 font-mono bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/20">
          Ready to review & export
        </span>
      </div>

      {/* Top View/Edit/Analysis Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('preview');
              setIsEditing(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Formatted Preview
          </button>

          <button
            onClick={() => {
              setActiveTab('edit');
              setIsEditing(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Click to Edit Document
          </button>

          <button
            onClick={() => {
              setActiveTab('intelligence');
              setIsEditing(false);
              if (!analysis && !isAnalyzing) {
                onRunAnalysis();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'intelligence'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Plain-English AI Analysis
          </button>
        </div>

        {/* Copy & Print Utility */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Copy plain text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Print Document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'edit' || isEditing ? (
        /* Editable Window (matching PDF page 20-21) */
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Edit Document Below:
              </h3>
              <p className="text-xs text-slate-400">
                Modify clauses, dates, party addresses, or add custom terms in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditText(documentText);
                  setIsEditing(false);
                  setActiveTab('preview');
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyEdit}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-all"
              >
                Apply & Save Changes
              </button>
            </div>
          </div>

          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={22}
            className="w-full p-4 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Press &apos;Apply & Save Changes&apos; to update formatted preview & exports</span>
            <span>{editText.length} characters • {editText.split(/\s+/).length} words</span>
          </div>
        </div>
      ) : activeTab === 'intelligence' ? (
        /* Legal AI Intelligence & Plain Language Explainer */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Legal Intelligence & Plain-English Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Translating legal jargon into plain English, spotlighting key obligations, deadlines, and risks.
              </p>
            </div>
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Re-analyze</span>
                </>
              )}
            </button>
          </div>

          {analysis ? (
            <div className="space-y-6">
              {/* Score Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] uppercase font-semibold text-slate-400">
                    Fairness Balance
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {analysis.score.fairness}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Equitable covenants between parties
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] uppercase font-semibold text-slate-400">
                    Clause Clarity
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mt-1">
                    {analysis.score.clarity}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Unambiguous definitions & deadlines
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] uppercase font-semibold text-slate-400">
                    Protection Level
                  </div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    {analysis.score.protection}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Enforceability & dispute remedies
                  </div>
                </div>
              </div>

              {/* Plain English Summary */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Plain English Executive Summary
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {analysis.plain_summary}
                </p>
              </div>

              {/* Key Obligations */}
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2.5">
                  Key Obligations & Stipulations
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {analysis.key_obligations.map((obligation, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{obligation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk & Review Flags */}
              {analysis.risk_flags && analysis.risk_flags.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2.5">
                    Clauses Requiring Special Attention
                  </h4>
                  <div className="space-y-2">
                    {analysis.risk_flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs ${
                          flag.severity === 'high'
                            ? 'bg-red-950/30 border-red-800/40 text-red-200'
                            : flag.severity === 'medium'
                            ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                            : 'bg-blue-950/30 border-blue-800/40 text-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{flag.title}</span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              flag.severity === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : flag.severity === 'medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {flag.severity} Attention
                          </span>
                        </div>
                        <p className="opacity-90">{flag.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
              <p className="text-sm">Click below to generate plain-English legal intelligence</p>
              <button
                onClick={onRunAnalysis}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                Analyze Agreement Now
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Formatted Legal Document Preview (matches PDF screenshot pages 20, 22, 23) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Document Header Bar */}
          <div className="bg-slate-950/90 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{documentType}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{datesInput || 'Current Date'}</span>
            </div>

            <button
              onClick={() => {
                setActiveTab('edit');
                setIsEditing(true);
              }}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Document
            </button>
          </div>

          {/* Legal Document Parchment / Paper Canvas */}
          <div className="p-6 sm:p-10 bg-white text-slate-900 font-serif leading-relaxed max-h-[750px] overflow-y-auto selection:bg-amber-200">
            {/* Embedded Logo & Header (as detailed in PDF Activity 2.1 & 4.2) */}
            <div className="text-center pb-6 mb-6 border-b border-slate-300">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <Scale className="w-6 h-6 text-slate-800 inline-block" />
                <span className="text-xl font-bold tracking-wider text-slate-900">
                  {branding.companyName.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans tracking-wide">
                AI LEGAL DOCUMENT GENERATOR • OFFICIAL BINDING COPY
              </p>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-sm sm:text-[15px] text-slate-800">
              {documentText.split('\n').map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) {
                  return <div key={idx} className="h-2" />;
                }

                // Main Heading
                if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-lg sm:text-xl font-bold text-center text-slate-900 my-4 tracking-wide uppercase"
                    >
                      {trimmed.replace(/^#+\s*/, '')}
                    </h2>
                  );
                }

                // Section Headers (e.g. 1. Services, 2. Term, WITNESSETH)
                const isSection =
                  /^[0-9]+\.\s+[A-Z]/.test(trimmed) ||
                  trimmed === 'WITNESSETH:' ||
                  trimmed === 'Between:' ||
                  trimmed === 'And:' ||
                  trimmed.startsWith('NOW, THEREFORE') ||
                  trimmed.startsWith('IN WITNESS WHEREOF');

                if (isSection) {
                  return (
                    <div
                      key={idx}
                      className="font-bold text-slate-950 mt-4 mb-1 text-[15px]"
                    >
                      {trimmed}
                    </div>
                  );
                }

                // Signature lines
                if (trimmed.startsWith('___') || trimmed.startsWith('---')) {
                  return (
                    <div
                      key={idx}
                      className="border-b border-slate-700 w-64 my-4"
                    />
                  );
                }

                return (
                  <p key={idx} className="text-justify leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Structured Terms Table if present (matching PDF page 8, 9, 15) */}
            {branding.includeTermsTable && termsList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-sans">
                  Table of Stipulated Terms & Conditions
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-sans border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-left">
                        <th className="border border-slate-300 p-2 w-20">Clause #</th>
                        <th className="border border-slate-300 p-2">Stipulated Provision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {termsList.map((term, i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                          <td className="border border-slate-300 p-2 font-semibold text-slate-600">
                            Clause {i + 1}
                          </td>
                          <td className="border border-slate-300 p-2 text-slate-800">
                            {term}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Document Footer (as highlighted on PDF page 23) */}
            <div className="mt-12 pt-6 border-t border-slate-300 text-center font-sans text-[11px] text-slate-500">
              <p>
                {branding.companyName} | {branding.contactEmail} | All Rights Reserved
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Generated via LegalEase AI Core Engine
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Format Download Options Bar (exact match with PDF pages 14, 21, 22, 23) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              Download & Export Document
            </h4>
            <p className="text-xs text-slate-400">
              Export in three production formats: Microsoft Word (.docx), Branded PDF, or Plain Text (.txt)
            </p>
          </div>
        </div>

        {/* 3 Download Buttons (styled matching PDF page 21) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TXT */}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all hover:border-slate-500 shadow group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-700 group-hover:bg-slate-600 flex items-center justify-center text-slate-200">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold">Download as .TXT</div>
              <div className="text-[10px] text-slate-400">Plain text clean copy</div>
            </div>
          </button>

          {/* DOCX */}
          <button
            onClick={handleDownloadDocx}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 text-blue-100 font-medium text-xs border border-blue-700/50 hover:border-blue-500 transition-all shadow group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-800/80 group-hover:bg-blue-700 flex items-center justify-center text-blue-200">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold">Download as .DOCX</div>
              <div className="text-[10px] text-blue-300">Word format with tables & logo</div>
            </div>
          </button>

          {/* PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-100 font-medium text-xs border border-rose-700/50 hover:border-rose-500 transition-all shadow group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-800/80 group-hover:bg-rose-700 flex items-center justify-center text-rose-200">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold">Download as .PDF</div>
              <div className="text-[10px] text-rose-300">Branded with logo & footers</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
