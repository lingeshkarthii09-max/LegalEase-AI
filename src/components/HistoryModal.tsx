import React from 'react';
import { X, History, Trash2, ArrowRight, FileText, Calendar } from 'lucide-react';

export interface SavedDraft {
  id: string;
  timestamp: string;
  documentType: string;
  parties: string;
  terms: string;
  dates: string;
  content: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: SavedDraft[];
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Saved Document Drafts
              </h3>
              <p className="text-xs text-slate-400">
                Previously generated contracts stored safely in your browser session
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
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {drafts.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>No saved documents yet.</p>
              <p className="text-slate-600 mt-1">
                Generated contracts will automatically appear here.
              </p>
            </div>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onLoadDraft(d);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {d.documentType}
                    </h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{d.parties}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {d.terms}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onLoadDraft(d);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors text-xs font-medium flex items-center gap-1"
                    title="Load draft into editor"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(d.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {drafts.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All Drafts
            </button>
            <span className="text-xs text-slate-500">
              {drafts.length} draft{drafts.length !== 1 ? 's' : ''} available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
