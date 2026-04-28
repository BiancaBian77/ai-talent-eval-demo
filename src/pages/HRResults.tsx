import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamBatch } from '../data/mockData';
import type { ExamResult } from '../types';
import { ArrowLeft, Search, Download, Eye, X, Activity, Brain } from 'lucide-react';

export default function HRResults() {
  const navigate = useNavigate();
  const { config, stats, results } = mockExamBatch;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<ExamResult | null>(null);

  const filteredResults = results.filter(r => {
    const matchSearch = r.candidate.name.includes(searchTerm) || r.candidate.university?.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || (statusFilter === 'passed' ? r.score.passed : !r.score.passed);
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-dark)',
        padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> 返回
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>{config.batchName}</h1>
          <p className="text-xs text-muted">评测结果 · {stats.completed}/{stats.total} 已完成</p>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-outline btn-sm">
          <Download size={14} /> 导出报告
        </button>
      </header>

      <div style={{ padding: '20px 32px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Stats Bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12,
          marginBottom: 20,
        }}>
          {[
            { label: '已评人数', value: stats.completed, color: '#6366F1' },
            { label: '通过人数', value: stats.passed, color: '#10B981' },
            { label: '未通过', value: stats.failed, color: '#EF4444' },
            { label: '通过率', value: `${Math.round(stats.passed / stats.completed * 100)}%`, color: '#8B5CF6' },
            { label: '平均分', value: stats.avgScore.toFixed(1), color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 14, textAlign: 'center' }}>
              <p className="text-xs text-muted">{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Filter + Results List */}
          <div>
            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="搜索候选人姓名或学校..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px 8px 32px',
                    borderRadius: 6, background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-dark)',
                    color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                style={{
                  padding: '8px 12px', borderRadius: 6,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-dark)',
                  color: 'var(--text-primary)', fontSize: 13,
                }}
              >
                <option value="all">全部状态</option>
                <option value="passed">✅ 通过</option>
                <option value="failed">❌ 未通过</option>
              </select>
            </div>

            {/* Results List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredResults.map((r) => (
                <div
                  key={r.candidate.id}
                  onClick={() => setSelectedCandidate(r)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 8,
                    background: selectedCandidate?.candidate.id === r.candidate.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: `1px solid ${selectedCandidate?.candidate.id === r.candidate.id ? 'var(--accent)' : 'var(--border-dark)'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted" style={{ width: 20 }}>#{r.rank}</span>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: r.score.passed ? 'var(--success-bg)' : 'var(--danger-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                      color: r.score.passed ? 'var(--success)' : 'var(--danger)',
                    }}>{r.candidate.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold">{r.candidate.name}</p>
                      <p className="text-xs text-muted">{r.candidate.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Mini score bars */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {r.score.breakdown.map((b, j) => (
                        <div key={j} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 4,
                            background: scoreColorBg(b.score),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 700,
                            color: scoreColor(b.score),
                          }}>{b.type}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 60 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: r.score.passed ? 'var(--success)' : 'var(--danger)' }}>
                        {r.score.total}
                      </p>
                      <p className="text-xs text-muted">前 {r.percentile}%</p>
                    </div>
                    <span className={`badge ${r.score.passed ? 'badge-success' : 'badge-danger'}`}>
                      {r.score.passed ? '通过' : '未通过'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Candidate Detail */}
          <div>
            {selectedCandidate ? (
              <div className="card animate-slideUp" style={{ padding: 20 }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: selectedCandidate.score.passed ? 'var(--success-bg)' : 'var(--danger-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700,
                      color: selectedCandidate.score.passed ? 'var(--success)' : 'var(--danger)',
                    }}>{selectedCandidate.candidate.name[0]}</div>
                    <div>
                      <h3 className="font-semibold">{selectedCandidate.candidate.name}</h3>
                      <p className="text-xs text-muted">{selectedCandidate.candidate.university} · {selectedCandidate.candidate.email}</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedCandidate(null)}>
                    <X size={14} />
                  </button>
                </div>

                {/* Total Score */}
                <div style={{
                  textAlign: 'center', padding: '16px 0',
                  borderBottom: '1px solid var(--border-dark)', marginBottom: 16,
                }}>
                  <p style={{ fontSize: 36, fontWeight: 700, color: selectedCandidate.score.passed ? 'var(--success)' : 'var(--danger)' }}>
                    {selectedCandidate.score.total}
                  </p>
                  <p className="text-sm text-muted">综合评分 (满分100) · 排名 #{selectedCandidate.rank}</p>
                </div>

                {/* Score Breakdown */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">各题型得分</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedCandidate.score.breakdown.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="badge badge-info" style={{ minWidth: 28, textAlign: 'center' }}>{b.type}</span>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted">
                              {['需求到交付', 'AI找茬', '方案评审', '快速学习'][i]}
                            </span>
                            <span className="text-xs font-semibold">{b.score}/{b.maxScore}</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${(b.score / b.maxScore) * 100}%`,
                              background: scoreColor(b.score),
                              borderRadius: 3, transition: 'width 0.5s',
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* L2 Dimensions */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} style={{ color: 'var(--accent)' }} />
                    <h4 className="text-sm font-semibold">AI 行为分析 (L2)</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Prompt 策略', value: selectedCandidate.score.l2Dimensions.promptQuality },
                      { label: 'Debug 独立性', value: selectedCandidate.score.l2Dimensions.debugIndependence },
                      { label: '任务拆解', value: selectedCandidate.score.l2Dimensions.taskDecomposition },
                      { label: 'AI 依赖度', value: 6 - selectedCandidate.score.l2Dimensions.aiDependency },
                    ].map((dim, i) => (
                      <div key={i} style={{
                        background: 'var(--bg-tertiary)', borderRadius: 6, padding: 8,
                      }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted">{dim.label}</span>
                          <span className="text-xs font-semibold">{dim.value}/5</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map(dot => (
                            <div key={dot} style={{
                              width: '100%', height: 4, borderRadius: 2,
                              background: dot <= dim.value ? 'var(--accent)' : 'var(--border-dark)',
                            }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavior Data */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} style={{ color: 'var(--warning)' }} />
                    <h4 className="text-sm font-semibold">行为数据摘要</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {[
                      { label: 'AI 提问', value: `${selectedCandidate.behavior.aiPromptCount} 次` },
                      { label: '代码变更', value: `${selectedCandidate.behavior.codeChanges} 次` },
                      { label: '测试运行', value: `${selectedCandidate.behavior.testRuns} 次` },
                      { label: '切屏次数', value: `${selectedCandidate.behavior.tabSwitches} 次`, warn: selectedCandidate.behavior.tabSwitches > 0 },
                      { label: '错误数', value: `${selectedCandidate.behavior.errorsEncountered} 个` },
                      { label: '键盘事件', value: `${selectedCandidate.behavior.keystrokeCount}` },
                    ].map((d, i) => (
                      <div key={i} style={{
                        background: d.warn ? 'var(--warning-bg)' : 'var(--bg-tertiary)',
                        borderRadius: 6, padding: '6px 8px', textAlign: 'center',
                      }}>
                        <p className="text-xs text-muted">{d.label}</p>
                        <p className={`text-sm font-semibold ${d.warn ? '' : ''}`}
                          style={d.warn ? { color: 'var(--warning)' } : {}}
                        >{d.value}</p>
                      </div>
                    ))}
                  </div>
                  {selectedCandidate.behavior.anomalyFlags.length > 0 && (
                    <div style={{
                      marginTop: 8, padding: '8px 12px',
                      background: 'var(--danger-bg)', borderRadius: 6,
                      border: '1px solid #FECACA',
                    }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>⚠️ 异常标记</p>
                      {selectedCandidate.behavior.anomalyFlags.map((f, i) => (
                        <p key={i} className="text-xs" style={{ color: '#B91C1C' }}>• {f}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: 60, textAlign: 'center',
              }}>
                <Eye size={40} style={{ color: 'var(--text-secondary)', marginBottom: 12 }} />
                <p className="text-muted">点击左侧候选人查看详情</p>
                <p className="text-xs text-muted mt-1">查看 L1/L2 评分、行为数据和异常标记</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return 'var(--accent)';
  if (score >= 40) return 'var(--warning)';
  return 'var(--danger)';
}

function scoreColorBg(score: number): string {
  if (score >= 80) return 'var(--success-bg)';
  if (score >= 60) return 'var(--accent-light)';
  if (score >= 40) return 'var(--warning-bg)';
  return 'var(--danger-bg)';
}
