import React, { useRef, useEffect, useState } from 'react';
import { Send, Mic, MicOff, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const QUICK_CHIPS = [
  'UIT B.Tech CSE Specializations',
  'Data Science with Google Cloud at UIT',
  'Karnavati University Admissions 2026',
  'Eligibility for B.Tech (JEE / GUJCET)',
  'Merit Scholarships & Financial Aid',
  'Hostel & Mess Facilities (Uvarsad)',
  'Corporate Resource Center & Placements',
  'Official Helplines & Location',
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Browser Speech Recognition for voice input
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-sky-100 p-3 sm:p-4 shadow-lg shadow-sky-900/5">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="shrink-0 text-[10px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-sky-600" />
            Quick:
          </span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading || disabled}
              onClick={() => {
                onSendMessage(chip);
              }}
              className="shrink-0 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg border border-sky-200/80 font-medium transition cursor-pointer disabled:opacity-50 text-[11px]"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Field Container */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-white rounded-2xl border border-sky-200 shadow-xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition p-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isListening
                ? 'bg-rose-100 text-rose-600 animate-pulse'
                : 'text-slate-400 hover:text-sky-600 hover:bg-sky-50'
            }`}
            title={isListening ? 'Stop listening' : 'Dictate with microphone'}
            aria-label={isListening ? 'Stop listening' : 'Dictate question'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about courses, exams, admissions, library, fees..."
            disabled={disabled}
            className="flex-1 max-h-36 resize-none bg-transparent py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
              input.trim() && !isLoading && !disabled
                ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/30'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
            title="Send query"
            aria-label="Send query"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info note */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" />
            Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break
          </span>
          <span className="hidden sm:inline">
            Karnavati University AI Knowledge Engine
          </span>
        </div>
      </div>
    </div>
  );
};
