import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { mockQuestions, getAIResponse, terminalOutputs } from '../data/mockData';
import { Timer, ChevronRight, Terminal as TerminalIcon, MessageSquare, Code2, Activity, Lock } from 'lucide-react';

type RightTab = 'editor' | 'chat' | 'terminal';

export default function Sandbox() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [code, setCode] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    mockQuestions.forEach(q => { init[q.id] = q.starterCode || ''; });
    return init;
  });
  const [rightTab, setRightTab] = useState<RightTab>('editor');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string; time: string}>>([
    { role: 'ai', content: '你好！我是你的 AI 编程助手。在笔试过程中你可以自由使用我来辅助编码。准备好了就开始吧！', time: '00:00' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{cmd: string; out: string}>>([]);

  // Timer
  const totalTime = 45 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  const question = mockQuestions[currentQ];
  const questionTimeLimits = [20 * 60, 15 * 60, 5 * 60, 5 * 60];
  const questionTimeElapsed = questionTimeLimits.slice(0, currentQ).reduce((a, b) => a + b, 0);
  const currentQuestionTimeLeft = Math.max(0, questionTimeLimits[currentQ] - (totalTime - questionTimeElapsed - timeLeft));

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          navigate(`/exam/${examId}/submission`);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examId, navigate]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const now = formatTime(45 * 60 - timeLeft);
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput, time: now }]);
    const questionContext = question.title + ' ' + question.description.substring(0, 100);
    const response = getAIResponse(questionContext);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: response, time: now }]);
    }, 800);
    setChatInput('');
  };

  const handleTerminalCmd = () => {
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    const out = terminalOutputs[cmd] || `bash: ${cmd}: command not found`;
    setTerminalHistory(prev => [...prev, { cmd, out }]);
    setTerminalInput('');
  };

  const handleNextQuestion = () => {
    if (currentQ < 3) {
      setCurrentQ(currentQ + 1);
      setRightTab('editor');
    }
  };

  const handleSubmit = () => {
    navigate(`/exam/${examId}/submission`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0D1117' }}>
      {/* Top Bar */}
      <header style={{
        height: 44, background: '#161B22', borderBottom: '1px solid #30363D',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', flexShrink: 0,
      }}>
        <div className="flex items-center gap-3">
          <span style={{ fontWeight: 700, fontSize: 14, color: '#58A6FF' }}>AI Talent Evaluation</span>
          <span style={{ color: '#30363D' }}>|</span>
          <span className="text-sm" style={{ color: '#8B949E' }}>校招笔试 · 沙箱环境</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Question Progress */}
          <div className="flex items-center gap-2">
            {mockQuestions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-1">
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i < currentQ ? '#238636' : i === currentQ ? '#1F6FEB' : '#21262D',
                  border: i === currentQ ? '2px solid #58A6FF' : '1px solid #30363D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  color: i <= currentQ ? '#fff' : '#8B949E',
                  transition: 'all 0.3s',
                }}>
                  {i < currentQ ? '✓' : q.type}
                </div>
                {i < 3 && <div style={{ width: 12, height: 1, background: '#30363D' }} />}
              </div>
            ))}
          </div>

          <div style={{ color: '#30363D' }}>|</div>

          {/* Timer */}
          <div className="flex items-center gap-2" style={{
            background: timeLeft < 300 ? '#3D1F1F' : '#1A2332',
            padding: '4px 12px', borderRadius: 6,
            border: `1px solid ${timeLeft < 300 ? '#DA3633' : '#30363D'}`,
          }}>
            <Timer size={14} style={{ color: timeLeft < 300 ? '#DA3633' : '#58A6FF' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
              color: timeLeft < 300 ? '#DA3633' : '#E6EDF3',
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={handleSubmit}
          >
            交卷
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Question */}
        <div style={{
          width: '35%', minWidth: 380,
          background: '#161B22', borderRight: '1px solid #30363D',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Question Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #30363D',
            background: '#0D1117',
          }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="badge" style={{
                  background: typeColor(question.type).bg,
                  color: typeColor(question.type).text,
                  border: `1px solid ${typeColor(question.type).border}`,
                }}>
                  题型 {question.type}
                </span>
              <span className="text-xs" style={{ color: '#8B949E' }}>
                {question.timeLimit}min · 权重 {question.weight}% · 本题剩余 {formatTime(currentQuestionTimeLeft)}
              </span>
              </div>
              <span className="text-xs" style={{ color: '#8B949E' }}>
                {currentQ + 1} / 4
              </span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#E6EDF3' }}>{question.title}</h2>
          </div>

          {/* Question Body */}
          <div style={{
            flex: 1, overflow: 'auto', padding: 16,
            fontSize: 14, lineHeight: 1.7, color: '#C9D1D9',
          }}>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(question.description) }} />
          </div>

          {/* Question Footer */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #30363D',
            background: '#0D1117',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <div className="flex items-center gap-2">
              <Lock size={12} style={{ color: '#8B949E' }} />
              <span className="text-xs" style={{ color: '#8B949E' }}>沙箱环境 · 不可切出</span>
            </div>
            {currentQ < 3 ? (
              <button className="btn btn-primary btn-sm" onClick={handleNextQuestion}>
                下一题 <ChevronRight size={14} />
              </button>
            ) : (
              <button className="btn btn-danger btn-sm" onClick={handleSubmit}>
                完成作答，交卷
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Editor / Chat / Terminal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Tabs */}
          <div style={{
            height: 36, background: '#161B22', borderBottom: '1px solid #30363D',
            display: 'flex', alignItems: 'center', padding: '0 8px', gap: 2,
          }}>
            {([
              { id: 'editor', icon: <Code2 size={14} />, label: 'Code Editor' },
              { id: 'chat', icon: <MessageSquare size={14} />, label: 'AI Chat' },
              { id: 'terminal', icon: <TerminalIcon size={14} />, label: 'Terminal' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', border: 'none', borderRadius: '6px 6px 0 0',
                  cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  background: rightTab === tab.id ? '#0D1117' : 'transparent',
                  color: rightTab === tab.id ? '#E6EDF3' : '#8B949E',
                  borderBottom: rightTab === tab.id ? '2px solid #58A6FF' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {rightTab === 'editor' && (
              <div style={{ height: '100%' }}>
                <Editor
                  height="100%"
                  defaultLanguage={question.type === 'C' || question.type === 'D' ? 'markdown' : 'typescript'}
                  theme="vs-dark"
                  value={code[question.id]}
                  onChange={(val) => {
                    setCode(prev => ({ ...prev, [question.id]: val || '' }));
                    // Don't log every keystroke to avoid flooding
                  }}
                  options={{
                    fontSize: 14,
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 16 },
                  }}
                />
              </div>
            )}

            {rightTab === 'chat' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D1117' }}>
                <div style={{
                  flex: 1, overflow: 'auto', padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10,
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        background: msg.role === 'ai' ? '#1F6FEB' : '#238636',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {msg.role === 'ai' ? 'AI' : 'U'}
                      </div>
                      <div style={{
                        maxWidth: '80%',
                        background: msg.role === 'ai' ? '#161B22' : '#1A2332',
                        borderRadius: '8px 8px 8px 0',
                        padding: '10px 14px',
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: '#C9D1D9',
                        border: '1px solid #30363D',
                      }}>
                        <pre style={{
                          fontFamily: 'inherit', whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word', margin: 0,
                        }}>{msg.content}</pre>
                        <span className="text-xs" style={{ color: '#484F58', display: 'block', marginTop: 4 }}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={el => el?.scrollIntoView({ behavior: 'smooth' })} />
                </div>
                <div style={{
                  padding: 12, borderTop: '1px solid #30363D',
                  display: 'flex', gap: 8,
                }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="向 AI 助手提问..."
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 6,
                      background: '#161B22', border: '1px solid #30363D',
                      color: '#C9D1D9', fontSize: 13, outline: 'none',
                    }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleSendChat}>发送</button>
                </div>
              </div>
            )}

            {rightTab === 'terminal' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D1117' }}>
                <div style={{
                  flex: 1, overflow: 'auto', padding: 16,
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  lineHeight: 1.6, color: '#C9D1D9',
                }}>
                  <div style={{ color: '#8B949E', marginBottom: 8 }}>
                    ╔══════════════════════════════════════╗
                    <br />
                    ║  AI Talent Eval · 沙箱终端         ║
                    <br />
                    ║  Node.js v20 · TypeScript 5.x     ║
                    <br />
                    ╚══════════════════════════════════════╝
                  </div>
                  {terminalHistory.map((entry, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <div style={{ color: '#58A6FF' }}>$ {entry.cmd}</div>
                      <pre style={{
                        fontFamily: 'inherit', margin: '4px 0 0 0',
                        color: '#C9D1D9', whiteSpace: 'pre-wrap',
                      }}>{entry.out}</pre>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: 12, borderTop: '1px solid #30363D',
                  display: 'flex', gap: 8, alignItems: 'center',
                }}>
                  <span style={{ color: '#58A6FF', fontFamily: 'var(--font-mono)', fontSize: 13 }}>$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTerminalCmd()}
                    placeholder="输入命令..."
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 6,
                      background: '#161B22', border: '1px solid #30363D',
                      color: '#C9D1D9', fontSize: 13, fontFamily: 'var(--font-mono)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Behavior Tracking */}
      <footer style={{
        height: 28, background: '#161B22', borderTop: '1px solid #30363D',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16,
        flexShrink: 0,
      }}>
        <Activity size={12} style={{ color: '#238636' }} />
        <span className="text-xs" style={{ color: '#8B949E' }}>
          系统记录中：录屏 · AI对话 · 代码变更 · 测试运行 · 键盘事件
        </span>
        <div style={{ flex: 1 }} />
        <span className="text-xs" style={{
          color: '#238636', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#238636' }} />
          沙箱安全
        </span>
      </footer>
    </div>
  );
}

// --------------- Helpers ---------------

function typeColor(type: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: '#1A2332', text: '#58A6FF', border: '#1F6FEB' },
    B: { bg: '#2D1A1A', text: '#F78166', border: '#DA3633' },
    C: { bg: '#1A2D1A', text: '#7EE787', border: '#238636' },
    D: { bg: '#2D1A2D', text: '#D2A8FF', border: '#8957E5' },
  };
  return colors[type] || { bg: '#1A2332', text: '#58A6FF', border: '#1F6FEB' };
}

function renderMarkdown(text: string): string {
  return text
    .replace(/### (.+)/g, '<h3 style="font-size:15px;font-weight:600;color:#E6EDF3;margin:16px 0 8px">$1</h3>')
    .replace(/## (.+)/g, '<h2 style="font-size:16px;font-weight:700;color:#E6EDF3;margin:20px 0 10px">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E6EDF3">$1</strong>')
    .replace(/`{3}(\w*)\n([\s\S]*?)`{3}/g, '<pre style="background:#0D1117;border:1px solid #30363D;border-radius:6px;padding:12px;overflow:auto;font-family:var(--font-mono);font-size:13px;line-height:1.5;margin:8px 0"><code>$2</code></pre>')
    .replace(/`(.+?)`/g, '<code style="background:#21262D;padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:13px;color:#D2A8FF">$1</code>')
    .replace(/- (.+)/g, '<div style="display:flex;gap:6px;margin:2px 0;padding-left:4px"><span style="color:#484F58">•</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
