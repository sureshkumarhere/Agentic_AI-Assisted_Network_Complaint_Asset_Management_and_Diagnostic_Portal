import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAdminChatDetail, moveChatToReference, unassignChatFromReference } from '../../api/admin';
import { ChatTranscriptResponse } from '../../types';
import { ArrowLeft, FolderInput, RotateCcw, User, Bot, AlertCircle } from 'lucide-react';
import { MarkdownMessage } from '../../components/chat/MarkdownMessage';

const CATEGORY_SLUGS = [
  { slug: 'complaint-logs', name: 'Complaint & Fault Logs' },
  { slug: 'admin-observations', name: 'Admin Observations' },
  { slug: 'corrective-measures', name: 'Approved Corrective Measures' },
  { slug: 'frequent-problems', name: 'Frequently Encountered Problems' },
  { slug: 'student-guidelines', name: 'Student Troubleshooting Guidelines' },
  { slug: 'manuals-sops', name: 'Device Manuals & SOPs' }
];

export const ChatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatTranscriptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(CATEGORY_SLUGS[0].slug);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDetail = () => {
    if (!id) return;
    setIsLoading(true);
    getAdminChatDetail(id)
      .then((data) => setChat(data))
      .catch((err) => {
        if (err.message && err.message.includes('401')) {
          navigate('/admin/login');
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleMove = async () => {
    if (!id) return;
    try {
      await moveChatToReference(id, selectedCategorySlug);
      setToast('Chat moved to reference & indexed');
      fetchDetail();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to move chat');
    }
  };

  const handleUnassign = async () => {
    if (!id) return;
    try {
      await unassignChatFromReference(id);
      setToast('Chat unassigned and vector embeddings removed');
      fetchDetail();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to unassign chat');
    }
  };

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 font-sans flex flex-col">
      <header className="bg-noc-panel border-b border-noc-border shadow-noc sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/chats" className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Chat Transcript #{id?.slice(-6)}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        {toast && (
          <div className="mb-6 bg-noc-emerald/15 border border-noc-emerald/30 text-noc-emerald p-3.5 rounded-xl text-xs font-semibold">
            {toast}
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading transcript...</div>
        ) : !chat ? (
          <div className="p-12 text-center text-slate-500">Transcript not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transcript Messages */}
            <div className="md:col-span-2 bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 space-y-4">
              <h2 className="text-base font-bold text-white border-b border-noc-border pb-3">Conversation turns</h2>

              {chat.messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                        isUser ? 'bg-noc-accent' : 'bg-noc-surface border border-noc-border text-noc-cyan'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed overflow-hidden ${
                        isUser
                          ? 'bg-noc-accent text-white rounded-tr-none'
                          : 'bg-noc-surface border border-noc-border text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap text-xs">{msg.content}</div>
                      ) : (
                        <MarkdownMessage content={msg.content} />
                      )}
                      {msg.is_off_topic && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-noc-amber font-medium">
                          <AlertCircle className="w-3 h-3" /> Off-topic query
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Actions */}
            <div className="bg-noc-panel rounded-2xl shadow-noc border border-noc-border p-6 h-fit space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transcript Meta</h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><span className="font-semibold text-slate-400">Messages:</span> {chat.message_count} / 10</p>
                  <p><span className="font-semibold text-slate-400">Category:</span> {chat.detected_category || 'None'}</p>
                </div>
              </div>

              <div className="border-t border-noc-border pt-4">
                <h3 className="text-xs font-bold text-white mb-2">Promote to Reference</h3>
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => setSelectedCategorySlug(e.target.value)}
                  className="w-full p-2 text-xs border border-noc-border rounded-xl mb-3 bg-noc-bg text-slate-200 focus:outline-none focus:border-noc-accent"
                >
                  {CATEGORY_SLUGS.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-noc-panel text-slate-200">{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleMove}
                  className="w-full py-2 bg-noc-accent hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FolderInput className="w-3.5 h-3.5" /> Move &amp; Index
                </button>
              </div>

              <div className="border-t border-noc-border pt-4">
                <button
                  onClick={handleUnassign}
                  className="w-full py-2 border border-noc-border hover:bg-noc-surface text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Return to Unassigned
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
