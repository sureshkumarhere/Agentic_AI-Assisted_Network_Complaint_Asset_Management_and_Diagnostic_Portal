import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onUpload, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx', '.txt'].includes(ext)) {
      setError('Invalid file type. Allowed formats: .pdf, .docx, .txt');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds maximum size of 10 MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 mb-8 text-slate-100">
      <h3 className="text-sm font-bold text-white mb-3">Upload Knowledge Document</h3>

      {error && (
        <div className="mb-4 bg-noc-rose/15 border border-noc-rose/30 text-noc-rose p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-noc-accent bg-noc-surface/80'
            : 'border-noc-border hover:border-slate-500 bg-noc-surface/40'
        }`}
      >
        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-200 mb-1">
          Drag &amp; drop document here, or{' '}
          <label className="text-noc-cyan hover:underline cursor-pointer">
            browse files
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-[11px] text-slate-400 font-mono">Supports PDF, DOCX, TXT up to 10 MB</p>

        {selectedFile && (
          <div className="mt-4 p-3 bg-noc-bg rounded-xl border border-noc-border inline-flex items-center gap-3">
            <FileText className="w-5 h-5 text-noc-cyan" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="ml-3 px-3 py-1.5 bg-noc-accent hover:bg-blue-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload & Index'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
