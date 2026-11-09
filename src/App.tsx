/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeHero } from './components/WelcomeHero';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { CampusDirectoryModal } from './components/CampusDirectoryModal';
import { ClearChatModal } from './components/ClearChatModal';
import { Message, ChatSession } from './types/campus';
import { COLLEGE_INFO } from './data/sampleCollegeData';

const STORAGE_KEY = 'karnavati_campusbot_sessions_v1';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved sessions:', e);
    }
    return [
      {
        id: 'session-initial',
        title: 'Karnavati University Inquiry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-initial';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Active Session
  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  }, [sessions]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

  const updateActiveSessionMessages = (
    updater: (prevMsgs: Message[]) => Message[]
  ) => {
    setSessions((prevSessions) => {
      return prevSessions.map((sess) => {
        if (sess.id === activeSessionId) {
          const newMessages = updater(sess.messages);
          let title = sess.title;
          if (
            (sess.title === 'New College Inquiry' || !sess.title) &&
            newMessages.length > 0
          ) {
            const firstUser = newMessages.find((m) => m.sender === 'user');
            if (firstUser) {
              title =
                firstUser.text.slice(0, 32) +
                (firstUser.text.length > 32 ? '...' : '');
            }
          }
          return {
            ...sess,
            title,
            updatedAt: new Date().toISOString(),
            messages: newMessages,
          };
        }
        return sess;
      });
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    const botMessageId = `msg-${Date.now()}-b`;
    const initialBotMessage: Message = {
      id: botMessageId,
      sender: 'bot',
      text: '',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isStreaming: true,
      status: 'received',
    };

    // Append both to current session
    updateActiveSessionMessages((prev) => [...prev, userMessage, initialBotMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      // Check if SSE stream is returned
      if (response.body && response.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedBotText = '';
        let followUps: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawChunk = decoder.decode(value, { stream: true });
          const lines = rawChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  accumulatedBotText += data.text;
                }
                if (data.followUps && Array.isArray(data.followUps)) {
                  followUps = data.followUps;
                }
                if (data.done) {
                  // Stream finished
                }
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }

          // Update bot message with current accumulated text
          updateActiveSessionMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? {
                    ...m,
                    text: accumulatedBotText,
                    isStreaming: true,
                  }
                : m
            )
          );
        }

        // Finalize bot message
        updateActiveSessionMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  text: accumulatedBotText,
                  isStreaming: false,
                  suggestedFollowUps:
                    followUps.length > 0
                      ? followUps
                      : [
                          'What B.Tech specializations are offered by UIT?',
                          'What is the admission procedure on karnavatiuniversity.edu.in?',
                          'What hostel and campus facilities are available in Gandhinagar?',
                        ],
                }
              : m
          )
        );
      } else {
        // Standard JSON fallback
        const data = await response.json();
        updateActiveSessionMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  text: data.text || 'No response formulated.',
                  isStreaming: false,
                  suggestedFollowUps: data.followUps || [],
                }
              : m
          )
        );
      }
    } catch (err: any) {
      console.error('Error fetching chat response:', err);
      updateActiveSessionMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                text: 'I encountered a temporary connection glitch. Please check your network or try asking again.',
                isStreaming: false,
                status: 'error',
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    // If active session is already blank, don't spam new sessions
    if (messages.length === 0) return;

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'Karnavati University Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleClearChat = () => {
    updateActiveSessionMessages(() => []);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'Karnavati University Inquiry',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    let transcript = `# ${COLLEGE_INFO.name}\n`;
    transcript += `## CampusBot – AI Student Information Assistant - Transcript\n`;
    transcript += `Date: ${new Date().toLocaleDateString()} | Session: ${COLLEGE_INFO.currentSession}\n`;
    transcript += `Official Portal: ${COLLEGE_INFO.website} | Toll-Free: ${COLLEGE_INFO.tollFree}\n\n`;
    transcript += `---\n\n`;

    messages.forEach((m) => {
      const speaker = m.sender === 'user' ? 'Student' : 'CampusBot (AI Student Info Assistant)';
      transcript += `### [${m.timestamp}] ${speaker}:\n\n${m.text}\n\n`;
    });

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Karnavati-CampusBot-Transcript-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Application Header */}
      <Header
        onNewChat={handleNewChat}
        onClearChat={() => setIsClearModalOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onExportChat={handleExportChat}
        hasMessages={messages.length > 0}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Workspace: Sidebar + Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat History & Navigation Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => setActiveSessionId(id)}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (messages.length > 0) {
              handleNewChat();
            }
          }}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Center Chat Canvas */}
        <main className="flex-1 flex flex-col bg-slate-50/70 overflow-hidden relative">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto divide-y divide-sky-100/40"
          >
            {messages.length === 0 ? (
              <WelcomeHero
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSelectQuestion={(q) => handleSendMessage(q)}
              />
            ) : (
              <div className="max-w-4xl mx-auto divide-y divide-sky-100/50">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onSelectFollowUp={(q) => handleSendMessage(q)}
                    onRetry={() => {
                      const lastUserMsg = messages
                        .slice()
                        .reverse()
                        .find((m) => m.sender === 'user');
                      if (lastUserMsg) {
                        handleSendMessage(lastUserMsg.text);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sticky Input Bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </main>
      </div>

      {/* Modals */}
      <CampusDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onAskAboutItem={(topic) => handleSendMessage(topic)}
      />

      <ClearChatModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearChat}
      />
    </div>
  );
}
