import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, X } from 'lucide-react';
import { getStandaloneHtmlCode } from '../utils/generateStandaloneHtml';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const code = getStandaloneHtmlCode();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'findtune.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Standalone Single-File HTML Prototype</h3>
              <p className="text-[11px] text-slate-400">100% self-contained HTML + Tailwind CSS + Vanilla JS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-1">
            <span>findtune.html (Open directly in any browser)</span>
            <span className="font-mono">{Math.round(code.length / 1024)} KB</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 overflow-auto font-mono text-xs text-slate-300">
            <pre className="whitespace-pre-wrap">{code}</pre>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3">
          <a
            href="/standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rose-400 hover:text-rose-300 underline font-medium"
          >
            Open standalone view in new tab &rarr;
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
