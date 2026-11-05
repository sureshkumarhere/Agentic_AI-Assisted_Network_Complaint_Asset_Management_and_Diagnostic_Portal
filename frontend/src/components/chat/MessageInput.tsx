import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-noc-panel border-t border-noc-border">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Session trace limit reached' : 'Describe symptoms or paste ping/traceroute output...'}
          disabled={disabled}
          maxLength={500}
          rows={1}
          className="flex-1 min-h-[40px] max-h-28 p-2 text-xs font-mono bg-noc-bg border border-noc-border rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-noc-accent resize-none disabled:bg-noc-surface disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="h-10 px-3.5 bg-noc-accent hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-noc-glow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex justify-between items-center mt-1.5 text-[10px] font-mono text-slate-500 px-1">
        <span>Shift+Enter for newline</span>
        <span>{text.length}/500</span>
      </div>
    </form>
  );
};
