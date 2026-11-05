import React, { useEffect, useRef } from 'react';
import { ChatTurn, ProblemType } from '../../types';
import { Bot, User, AlertCircle, Cpu } from 'lucide-react';
import { MarkdownMessage } from './MarkdownMessage';

interface MessageListProps {
  messages: ChatTurn[];
  isLoading: boolean;
  detectedCategory: ProblemType | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  detectedCategory,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-noc-accent text-white border-blue-400'
                  : 'bg-noc-surface text-noc-cyan border-noc-border'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed border overflow-hidden ${
                isUser
                  ? 'bg-noc-accent text-white border-blue-500 shadow-noc'
                  : 'bg-noc-panel border-noc-border text-slate-200'
              }`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>
              ) : (
                <MarkdownMessage content={msg.content} />
              )}

              {/* Detected category chip on assistant reply */}
              {!isUser && detectedCategory && index === messages.length - 1 && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-noc-surface text-noc-cyan border border-noc-border">
                  <Cpu className="w-3 h-3 text-noc-cyan" />
                  <span>CLASSIFIED: {detectedCategory.replace(/_/g, ' ')}</span>
                </div>
              )}

              {/* Off-topic notice chip */}
              {msg.is_off_topic && (
                <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-noc-amber">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>NON-NETWORK TELEMETRY QUERY</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="bg-noc-panel border border-noc-border rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-noc-cyan animate-ping" />
              <span className="text-[11px] font-mono text-slate-400">Analyzing network trace...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
