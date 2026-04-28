import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockExamConfig } from '../data/mockData';
import { Shield, Video, Clock, FileText, ArrowRight, Check } from 'lucide-react';

export default function CandidateEntry() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'verify' | 'rules' | 'ready'>('verify');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [agreed, setAgreed] = useState(false);

  const config = mockExamConfig;

  const handleStart = () => {
    if (agreed && name && email) {
      navigate(`/exam/${examId}/sandbox`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div className="card animate-slideUp" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700,
          }}>AI</div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{config.batchName}</h1>
          <p className="text-sm text-muted mt-1">AI 人才评测 · 笔试环节</p>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 24,
        }}>
          {['verify', 'rules', 'ready'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step === s ? 'var(--accent)' : step > s ? 'var(--success)' : 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                transition: 'all 0.3s',
              }}>
                {step > s ? <Check size={14} /> : i + 1}
              </div>
              {i < 2 && <div style={{ width: 32, height: 2, background: 'var(--border-dark)' }} />}
            </div>
          ))}
        </div>

        {/* Content */}
        {step === 'verify' && (
          <div>
            <h3 className="font-semibold mb-3">身份验证</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text" placeholder="姓名"
                value={name} onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email" placeholder="邮箱"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text" placeholder="学校（选填）"
                value={university} onChange={e => setUniversity(e.target.value)}
                style={inputStyle}
              />
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 8 }}
                disabled={!name || !email}
                onClick={() => setStep('rules')}
              >
                下一步 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'rules' && (
          <div>
            <h3 className="font-semibold mb-3">评测规则</h3>
            <div style={{
              background: 'var(--bg-tertiary)', borderRadius: 8, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div className="flex gap-3">
                <Clock size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold">总时长 45 分钟</p>
                  <p className="text-xs text-muted">共 4 个题型，按顺序作答，不可回退</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FileText size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold">4 个题型</p>
                  <p className="text-xs text-muted">需求到交付 (20min) → AI 找茬 (15min) → 方案评审 (5min) → 快速学习 (5min)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield size={16} style={{ color: 'var(--warning)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold">诚信要求</p>
                  <p className="text-xs text-muted">不可切出沙箱环境、不可使用外部设备。系统全程录屏</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Video size={16} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold">录屏授权</p>
                  <p className="text-xs text-muted">笔试过程将被录制，仅用于评分和防作弊</p>
                </div>
              </div>
            </div>

            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 16, cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
              />
              <span className="text-sm">我已阅读并同意评测规则，授权录屏</span>
            </label>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep('verify')}>
                返回
              </button>
              <button
                className="btn btn-primary" style={{ flex: 1 }}
                disabled={!agreed}
                onClick={() => setStep('ready')}
              >
                确认规则
              </button>
            </div>
          </div>
        )}

        {step === 'ready' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--success-bg)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={32} style={{ color: 'var(--success)' }} />
            </div>
            <h3 className="font-semibold mb-2">准备就绪</h3>
            <p className="text-sm text-muted mb-1">{name} · {email}</p>
            <p className="text-xs text-muted mb-4">
              点击开始后将进入沙箱环境，计时开始
            </p>
            <div style={{
              background: 'var(--bg-tertiary)', borderRadius: 8, padding: 12, marginBottom: 16,
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            }}>
              {config.questions.map(q => (
                <div key={q.id} style={{ textAlign: 'center' }}>
                  <span className="badge badge-info" style={{ marginBottom: 4 }}>题型{q.type}</span>
                  <p className="text-xs text-muted">{q.timeLimit}min</p>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleStart}>
              开始笔试 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 6,
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-dark)',
  color: 'var(--text-primary)', fontSize: 14,
  outline: 'none',
};
