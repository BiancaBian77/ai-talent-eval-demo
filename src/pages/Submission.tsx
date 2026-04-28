import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockQuestions } from '../data/mockData';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Submission() {
  const _params = useParams(); // examId available for future use
  void _params;
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1A2332 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div className="card animate-slideUp" style={{ maxWidth: 480, width: '100%', padding: 40, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--success-bg)', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>作答已提交</h1>
          <p className="text-sm text-muted mb-2">
            系统将自动进行评分，结果将在评测批次结束后公布
          </p>
          <div style={{
            background: 'var(--bg-tertiary)', borderRadius: 8, padding: 16, marginTop: 20,
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              <span className="font-semibold text-sm">AI 评分引擎</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'L1 自动判分', desc: '测试通过率 + 代码质量分析', status: 'running' },
                { label: 'L2 AI 行为分析', desc: 'Prompt策略 + Debug独立性 + 拆解能力', status: 'pending' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3" style={{
                  padding: '6px 12px', borderRadius: 6,
                  background: step.status === 'running' ? 'var(--accent-light)' : 'transparent',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${step.status === 'running' ? 'var(--accent)' : 'var(--border-dark)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.status === 'running' && (
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: 'var(--accent)',
                      }} className="animate-pulse" />
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div className="card animate-slideUp" style={{ maxWidth: 520, width: '100%', padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>确认交卷</h1>
        <p className="text-sm text-muted mb-6">请确认各题型作答完成后提交</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockQuestions.map((q) => (
            <div key={q.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 8,
              border: '1px solid var(--border-dark)',
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: q.type === 'A' ? 'var(--accent-light)' : q.type === 'B' ? 'var(--warning-bg)' : q.type === 'C' ? 'var(--success-bg)' : '#F3E8FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: q.type === 'A' ? 'var(--accent)' : q.type === 'B' ? 'var(--warning)' : q.type === 'C' ? 'var(--success)' : '#8957E5',
                }}>{q.type}</div>
                <div>
                  <p className="text-sm font-semibold">{q.title}</p>
                  <p className="text-xs text-muted">{q.timeLimit}min · {q.weight}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs text-muted">已作答</span>
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 14,
          background: 'var(--warning-bg)', borderRadius: 8,
          border: '1px solid #FDE68A',
          display: 'flex', gap: 10,
        }}>
          <AlertCircle size={18} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#92400E' }}>提交后不可修改</p>
            <p className="text-xs" style={{ color: '#A16207' }}>
              确认提交后，系统将锁定所有作答内容并开始自动评分
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(-1)}>
            返回修改
          </button>
          <button className="btn btn-danger btn-lg" style={{ flex: 1 }} onClick={handleConfirm}>
            确认交卷 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
