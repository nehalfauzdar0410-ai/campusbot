import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Message } from '../types/campus';
import { MarkdownView } from './MarkdownView';

interface ChatMessageProps {
  message: Message;
  onSelectFollowUp: (question: string) => void;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectFollowUp,
  onRetry,
}) => {
  const isBot = message.sender === 'bot';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown characters for smooth speech
    const cleanText = message.text
      .replace(/[#*`_>]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`py-4 px-3 sm:px-6 flex gap-3 sm:gap-4 transition ${
        isBot ? 'bg-sky-50/30 border-b border-sky-100/50' : 'bg-white'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isBot ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-xs shadow-sky-600/30 ring-2 ring-sky-100">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {isBot ? 'CampusBot' : 'Student'}
            </span>
            {isBot && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                <Sparkles className="w-2.5 h-2.5 text-sky-600" />
                AI Student Information Assistant
              </span>
            )}
            <span className="text-[11px] text-slate-400">{message.timestamp}</span>
          </div>

          {/* Quick message tools for Bot answers */}
          {isBot && message.text && !message.isStreaming && (
            <div className="flex items-center gap-1 text-slate-400">
              {/* Audio Reader */}
              <button
                onClick={handleSpeak}
                className={`p-1 rounded-md transition ${
                  speaking ? 'text-sky-600 bg-sky-100' : 'hover:text-sky-700 hover:bg-sky-50'
                }`}
                title={speaking ? 'Stop speech' : 'Listen to answer'}
                aria-label={speaking ? 'Stop audio' : 'Listen to audio'}
              >
                {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="p-1 hover:text-sky-700 hover:bg-sky-50 rounded-md transition"
                title="Copy response to clipboard"
                aria-label="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Feedback Likes */}
              <button
                onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
                className={`p-1 rounded-md transition ${
                  feedback === 'liked' ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Helpful response"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
                className={`p-1 rounded-md transition ${
                  feedback === 'disliked' ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Inaccurate or needs improvement"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Message Body */}
        {isBot ? (
          <div className="text-sm text-slate-800">
            {message.text ? (
              <MarkdownView content={message.text} />
            ) : message.isStreaming ? (
              <div className="flex items-center gap-2 text-sky-700 text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span>
                <span>Consulting Karnavati University verified repository...</span>
              </div>
            ) : null}

            {/* Pulsing cursor while streaming */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-sky-500 animate-pulse ml-1 align-middle rounded-xs" />
            )}

            {/* Error state */}
            {message.status === 'error' && (
              <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-3">
                <span>Failed to complete response. Please check your network or try again.</span>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1 font-semibold text-rose-800 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                )}
              </div>
            )}

            {/* Follow-up question suggestion chips */}
            {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && !message.isStreaming && (
              <div className="mt-4 pt-3 border-t border-sky-100/80 space-y-2">
                <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  Suggested Next Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {message.suggestedFollowUps.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectFollowUp(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-800 bg-white hover:bg-sky-50 rounded-lg border border-sky-200 hover:border-sky-400 shadow-2xs transition cursor-pointer text-left"
                    >
                      <span>{item}</span>
                      <ArrowRight className="w-3 h-3 text-sky-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl rounded-tl-sm border border-sky-100/90 leading-relaxed font-medium">
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};
