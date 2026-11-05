import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminChats, deleteChat, moveChatToReference } from '../../api/admin';
import { ChatSummary } from '../../types';
import {
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  FolderInput,
  Trash2,
  X,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { formatUTCToIST } from '../../utils/date';

const CATEGORY_SLUGS = [
  { slug: 'complaint-logs', name: 'Complaint & Fault Logs' },
  { slug: 'admin-observations', name: 'Admin Observations' },
  { slug: 'corrective-measures', name: 'Approved Corrective Measures' },
  { slug: 'frequent-problems', name: 'Frequently Encountered Problems' },
  { slug: 'student-guidelines', name: 'Student Troubleshooting Guidelines' },
  { slug: 'manuals-sops', name: 'Device Manuals & SOPs' }
];

export const AllChats: React.FC = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Move dialog state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(CATEGORY_SLUGS[0].slug);
  const [toast, setToast] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchChats = () => {
    setIsLoading(true);
    getAdminChats('UNASSIGNED', page, q, categoryFilter)
      .then((data) => {
        setChats(data.chats);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch((err) => {
        if (err.message && err.message.includes('401')) {
          navigate('/admin/login');
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchChats();
  }, [page, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchChats();
  };

  const handleConfirmMove = async () => {
    if (!selectedChatId) return;
    try {
      await moveChatToReference(selectedChatId, selectedCategorySlug);
      setToast('Chat moved to reference category & queued for indexing');
      setSelectedChatId(null);
      fetchChats();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to move chat');
    }
  };

  const handleDelete = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat transcript?')) return;
    try {
      await deleteChat(chatId);
      setToast('Chat deleted successfully');
      fetchChats();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete chat');
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Unassigned Student Chats</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Toast alert */}
        {toast && (
          <div className="mb-6 bg-noc-emerald/15 border border-noc-emerald/30 text-noc-emerald p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search chat transcript text..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-noc-bg border border-noc-border text-slate-100 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-noc-accent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-noc-bg border border-noc-border rounded-xl text-slate-300 focus:outline-none focus:border-noc-accent"
          >
            <option value="" className="bg-noc-panel text-slate-300">All Categories</option>
            <option value="WIFI_PROBLEM" className="bg-noc-panel text-slate-300">Wi-Fi Problem</option>
            <option value="LAN_PROBLEM" className="bg-noc-panel text-slate-300">LAN Problem</option>
            <option value="IP_ADDRESS_ISSUE" className="bg-noc-panel text-slate-300">IP Address Issue</option>
            <option value="PROXY_ISSUE" className="bg-noc-panel text-slate-300">Proxy Issue</option>
            <option value="LAN_PORT_BROKEN" className="bg-noc-panel text-slate-300">LAN Port Broken</option>
          </select>
        </div>

        {/* Chats List Table Card */}
        <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No unassigned chats found.</div>
          ) : (
            <div className="divide-y divide-noc-border">
              {chats.map((chat) => (
                <div key={chat.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-noc-surface/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">#{chat.id.slice(-6)}</span>
                      {chat.detected_category && (
                        <span className="text-[10px] font-semibold bg-noc-surface border border-noc-border text-noc-cyan px-2 py-0.5 rounded-full">
                          {chat.detected_category.replace(/_/g, ' ')}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">{formatUTCToIST(chat.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium truncate">{chat.preview}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{chat.message_count} user messages</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/admin/chats/${chat.id}`}
                      className="px-3 py-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setSelectedChatId(chat.id)}
                      className="px-3 py-1.5 bg-noc-accent hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FolderInput className="w-3.5 h-3.5" />
                      Move to Ref
                    </button>
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="p-1.5 text-slate-500 hover:text-noc-rose hover:bg-noc-rose/10 rounded-lg transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 bg-noc-surface/40 border-t border-noc-border flex items-center justify-between text-xs text-slate-400">
            <span>Showing {chats.length} of {total} chats</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 border border-noc-border rounded-lg disabled:opacity-30 hover:bg-noc-surface text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {page} of {pages}</span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 border border-noc-border rounded-lg disabled:opacity-30 hover:bg-noc-surface text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Move to Reference Modal Dialog */}
      {selectedChatId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-noc-panel rounded-2xl shadow-2xl max-w-md w-full p-6 border border-noc-border text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Move Chat to Reference</h3>
              <button onClick={() => setSelectedChatId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Select one of six reference categories. The transcript will be indexed in ChromaDB for future student chatbot retrieval.
            </p>

            <div className="space-y-2 mb-6">
              {CATEGORY_SLUGS.map((cat) => (
                <label
                  key={cat.slug}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedCategorySlug === cat.slug
                      ? 'border-noc-accent bg-noc-surface/80 font-semibold text-noc-cyan'
                      : 'border-noc-border hover:bg-noc-surface/40 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug}
                    checked={selectedCategorySlug === cat.slug}
                    onChange={(e) => setSelectedCategorySlug(e.target.value)}
                    className="text-noc-accent focus:ring-0"
                  />
                  <span className="text-xs">{cat.name}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedChatId(null)}
                className="px-4 py-2 border border-noc-border rounded-xl text-xs font-semibold text-slate-300 hover:bg-noc-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-2 bg-noc-accent hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Confirm &amp; Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
