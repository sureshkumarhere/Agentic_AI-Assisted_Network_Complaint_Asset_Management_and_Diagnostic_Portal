import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getCategoryDetail,
  uploadDocument,
  deleteDocument,
  unassignChatFromReference,
  previewDocument,
  getAdminChatDetail
} from '../../api/admin';
import { CategoryDetailResponse } from '../../types';
import { UploadDropzone } from '../../components/admin/UploadDropzone';
import { renderAsync } from 'docx-preview';
import {
  Folder,
  ArrowLeft,
  FileText,
  MessageSquare,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [data, setData] = useState<CategoryDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'chats'>('documents');
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const [previewContent, setPreviewContent] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewType, setPreviewType] = useState<'pdf' | 'docx' | 'text'>('text');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [previewMode, setPreviewMode] = useState<'document' | 'chat'>('document');
  const docxPreviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !isPreviewOpen ||
      isPreviewLoading ||
      previewMode !== 'document' ||
      previewType !== 'docx' ||
      !docxPreviewRef.current ||
      !previewContent
    ) {
      return;
    }

    let cancelled = false;

    const renderDocx = async () => {
      const container = docxPreviewRef.current;
      if (!container) return;

      container.innerHTML = '';

      try {
        const response = await fetch(previewContent);
        if (!response.ok) {
          throw new Error('Unable to read DOCX file');
        }

        const blob = await response.blob();
        if (cancelled) return;

        await renderAsync(blob, container, undefined, {
          inWrapper: true,
          breakPages: true
        });
      } catch (error) {
        if (!cancelled) {
          container.textContent =
            error instanceof Error ? error.message : 'Unable to render DOCX preview.';
        }
      }
    };

    void renderDocx();

    return () => {
      cancelled = true;
    };
  }, [isPreviewOpen, isPreviewLoading, previewMode, previewType, previewContent]);

  const fetchCategory = () => {
    if (!categoryId) return;
    setIsLoading(true);
    getCategoryDetail(categoryId)
      .then((res) => setData(res))
      .catch((err) => {
        if (err.message && err.message.includes('401')) {
          navigate('/admin/login');
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const handleUploadFile = async (file: File) => {
    if (!categoryId) return;
    setIsUploading(true);
    try {
      await uploadDocument(categoryId, file);
      setToast(`Uploaded "${file.name}". Processing and vector indexing started.`);
      fetchCategory();
      setTimeout(() => setToast(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (docId: string, filename: string) => {
    if (!window.confirm(`Delete document "${filename}" and purge vector embeddings?`)) return;
    try {
      await deleteDocument(docId);
      setToast(`Document "${filename}" deleted.`);
      fetchCategory();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  const handlePreview = async (docId: string, fileName: string) => {
    setPreviewMode('document');
    setPreviewFileName(fileName);
    setPreviewContent('');
    setPreviewType('text');
    setIsPreviewOpen(true);
    setIsPreviewLoading(true);

    try {
      const result = await previewDocument(docId);
      setPreviewContent(result.content);
      setPreviewType(result.type);
    } catch (error) {
      setPreviewContent(
        `Unable to preview file: ${error instanceof Error ? error.message : 'Something went wrong'}`
      );
      setPreviewType('text');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleChatPreview = async (chatId: string, chatPreview: string) => {
    setPreviewMode('chat');
    setPreviewFileName('Chat Transcript');
    setPreviewContent('');
    setPreviewType('text');
    setIsPreviewOpen(true);
    setIsPreviewLoading(true);

    try {
      const chatDetail = await getAdminChatDetail(chatId);
      const textLines = chatDetail.messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n---\n\n');
      setPreviewContent(textLines);
    } catch (error) {
      setPreviewContent(
        `Unable to load chat: ${error instanceof Error ? error.message : 'Something went wrong'}`
      );
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleRemoveChat = async (chatId: string) => {
    if (!window.confirm('Remove this chat from reference knowledge base?')) return;
    try {
      await unassignChatFromReference(chatId);
      setToast('Chat unassigned and removed from vector index.');
      fetchCategory();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to remove chat');
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 font-sans flex flex-col">
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/reference"
              className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {data?.category.name || 'Category Detail'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {toast && (
          <div className="mb-6 bg-noc-emerald/15 border border-noc-emerald/30 text-noc-emerald p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading category content...</div>
        ) : !data ? (
          <div className="p-12 text-center text-slate-500">Category not found.</div>
        ) : (
          <div>
            {/* Category Header */}
            <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{data.category.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{data.category.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-noc-border flex items-center gap-6 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-noc-emerald" />
                  {data.documents.length} official documents
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-noc-cyan" />
                  {data.chats.length} curated chat transcripts
                </span>
              </div>
            </div>

            {/* Upload Area for documents */}
            <UploadDropzone onUpload={handleUploadFile} isUploading={isUploading} />

            {/* Tabs for Documents and Chats */}
            <div className="flex items-center gap-2 mb-6 border-b border-noc-border pb-3">
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'documents'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Documents ({data.documents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('chats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'chats'
                    ? 'bg-noc-accent text-white shadow-noc'
                    : 'bg-noc-panel border border-noc-border text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Promoted Chats ({data.chats.length})</span>
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'documents' ? (
              <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border overflow-hidden">
                {data.documents.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No documents uploaded to this category yet.
                  </div>
                ) : (
                  <div className="divide-y divide-noc-border">
                    {data.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-noc-surface/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{doc.original_filename}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                              <span>{(doc.size_bytes / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${
                                  doc.status === 'INDEXED'
                                    ? 'text-noc-emerald'
                                    : doc.status === 'FAILED'
                                    ? 'text-noc-rose'
                                    : 'text-noc-amber'
                                }`}
                              >
                                {doc.status === 'INDEXED' && <CheckCircle2 className="w-3 h-3" />}
                                {doc.status === 'PROCESSING' && <Clock className="w-3 h-3 animate-spin" />}
                                {doc.status === 'FAILED' && <AlertCircle className="w-3 h-3" />}
                                {doc.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Preview button */}
                          <button
                            type="button"
                            onClick={() => handlePreview(doc.id, doc.original_filename)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-noc-surface border border-transparent hover:border-noc-border transition-colors"
                            title="Preview document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download link if available */}
                          {doc.source_type === 'UPLOAD' && (
                            <a
                              href={`/api/admin/documents/${doc.id}/download`}
                              download={doc.original_filename}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-noc-surface border border-transparent hover:border-noc-border transition-colors"
                              title="Download original file"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}

                          {/* Delete document */}
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.original_filename)}
                            className="p-1.5 text-slate-400 hover:text-noc-rose rounded-lg hover:bg-noc-rose/10 transition-colors"
                            title="Delete document and purge vectors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border overflow-hidden">
                {data.chats.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No chats promoted to this category yet.
                  </div>
                ) : (
                  <div className="divide-y divide-noc-border">
                    {data.chats.map((chat) => (
                      <div
                        key={chat.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-noc-surface/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{chat.preview}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">
                            {chat.message_count} messages • #{chat.id.slice(-6)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleChatPreview(chat.id, chat.preview)}
                            className="px-3 py-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleRemoveChat(chat.id)}
                            className="px-3 py-1.5 bg-noc-amber/15 hover:bg-noc-amber/25 text-noc-amber border border-noc-amber/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Remove from Reference
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-noc-panel border border-noc-border shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-noc-border px-5 py-4">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-5 w-5 shrink-0 text-noc-cyan" />
                <h2 className="truncate text-base font-semibold text-white">
                  {previewFileName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (previewType === 'pdf' && previewContent.startsWith('blob:')) {
                    URL.revokeObjectURL(previewContent);
                  }
                  setIsPreviewOpen(false);
                }}
                className="ml-4 rounded-lg p-1.5 text-slate-400 hover:bg-noc-surface hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5 bg-noc-bg">
              {isPreviewLoading ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading preview...
                </p>
              ) : previewMode === 'document' && previewType === 'docx' ? (
                <div
                  ref={docxPreviewRef}
                  className="docx-preview-container min-w-0 bg-white text-slate-900 p-4 rounded-xl"
                />
              ) : previewMode === 'document' && previewType === 'pdf' ? (
                <iframe
                  src={previewContent}
                  title={previewFileName}
                  className="h-[70vh] w-full rounded-lg border border-noc-border"
                />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-200">
                  {previewContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
