import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamBatch } from '../data/mockData';
import { BarChart3, Users, Clock, CheckCircle2, Plus, ArrowRight, Eye, Settings } from 'lucide-react';

export default function HRDashboard() {
  const navigate = useNavigate();
  const { config, stats, results } = mockExamBatch;
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-dark)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16,
          }}>AI</div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>AI Talent Evaluation</h1>
            <p className="text-sm text-muted">笔试评测管理平台</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-success">● 系统运行中</span>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> 创建校招批次
          </button>
        </div>
      </header>

      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { icon: <Users size={20} />, label: '候选人总数', value: stats.total, color: '#6366F1' },
            { icon: <CheckCircle2 size={20} />, label: '已完成', value: stats.completed, color: '#10B981' },
            { icon: <BarChart3 size={20} />, label: '平均分', value: stats.avgScore.toFixed(1), color: '#F59E0B' },
            { icon: <Clock size={20} />, label: '通过率', value: `${Math.round(stats.passed / stats.completed * 100)}%`, color: '#8B5CF6' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>{stat.icon}</div>
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Batches */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>{config.batchName}</h2>
              <p className="text-sm text-muted mt-1">
                创建于 {new Date(config.createdAt).toLocaleDateString('zh-CN')} ·
                通过线 {config.passLine} 分 · 总时长 {config.totalTime} 分钟
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => navigate(`/hr/results/${config.id}`)}>
                <Eye size={14} /> 查看结果
              </button>
              <button className="btn btn-outline btn-sm">
                <Settings size={14} /> 配置
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 16 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">评测进度</span>
              <span className="text-sm font-semibold">{stats.completed}/{stats.total} 已完成</span>
            </div>
            <div style={{
              height: 8, borderRadius: 4, background: 'var(--bg-tertiary)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${(stats.completed / stats.total) * 100}%`,
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                borderRadius: 4, transition: 'width 0.5s',
              }} />
            </div>
          </div>

          {/* Question Config Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {config.questions.map((q) => (
              <div key={q.id} style={{
                background: 'var(--bg-tertiary)', borderRadius: 8, padding: 12,
                border: '1px solid var(--border-dark)',
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-info">题型{q.type}</span>
                  <span className="text-xs text-muted">{q.timeLimit}min · {q.weight}%</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{q.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Distribution Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4">分数分布</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, paddingTop: 20 }}>
              {stats.scoreDistribution.map((d) => {
                const maxCount = Math.max(...stats.scoreDistribution.map(x => x.count), 1);
                const height = (d.count / maxCount) * 140;
                return (
                  <div key={d.range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span className="text-xs font-semibold">{d.count}</span>
                    <div style={{
                      width: '100%', maxWidth: 48, height,
                      background: d.range === '80-100' ? 'var(--success)' : d.range === '60-80' ? 'var(--accent)' : 'var(--warning)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.5s',
                      minHeight: 4,
                    }} />
                    <span className="text-xs text-muted">{d.range}</span>
                  </div>
                );
              })}
            </div>
            <div style={{
              marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-dark)',
              display: 'flex', justifyContent: 'center', gap: 24,
            }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--danger)' }} />
                <span className="text-xs text-muted">不通过 ({stats.failed})</span>
              </div>
              <div style={{ width: 2, background: 'var(--border-dark)', height: 20 }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--success)' }} />
                <span className="text-xs text-muted">通过 ({stats.passed})</span>
              </div>
              <div style={{ width: 2, background: 'var(--border-dark)', height: 20 }} />
              <div style={{
                width: '60%', position: 'relative', height: 20,
              }}>
                <div style={{
                  position: 'absolute', left: `${(config.passLine / 100) * 100}%`, top: 0,
                  width: 2, height: '100%', background: 'var(--accent)',
                }} />
                <span className="text-xs" style={{
                  position: 'absolute', left: `${(config.passLine / 100) * 100}%`,
                  top: -18, transform: 'translateX(-50%)',
                  color: 'var(--accent)', fontWeight: 600,
                }}>通过线 {config.passLine}</span>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="card">
            <h3 className="font-semibold mb-4">已完成候选人</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 8,
                }}>
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: r.score.passed ? 'var(--success-bg)' : 'var(--danger-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      color: r.score.passed ? 'var(--success)' : 'var(--danger)',
                    }}>{r.candidate.name[0]}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{r.candidate.name}</p>
                      <p className="text-xs text-muted">{r.candidate.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 18, fontWeight: 700, color: r.score.passed ? 'var(--success)' : 'var(--danger)' }}>
                      {r.score.total}
                    </span>
                    <span className={`badge ${r.score.passed ? 'badge-success' : 'badge-danger'}`}>
                      {r.score.passed ? '通过' : '未通过'}
                    </span>
                    <span className="text-xs text-muted">#{r.rank}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-outline btn-sm mt-4"
              style={{ width: '100%' }}
              onClick={() => navigate(`/hr/results/${config.id}`)}
            >
              查看完整结果 <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Exam Link Section */}
        <div className="card mt-4">
          <h3 className="font-semibold mb-2">评测入口</h3>
          <p className="text-sm text-muted mb-3">候选人通过此链接进入笔试</p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-tertiary)', borderRadius: 8, padding: '8px 16px',
          }}>
            <code style={{ flex: 1, fontSize: 13, color: 'var(--accent)' }}>
              https://eval.example.com/exam/{config.id}
            </code>
            <button className="btn btn-primary btn-sm"
              onClick={() => navigate(`/exam/${config.id}`)}
            >
              预览入口 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal Overlay */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setShowCreateModal(false)}>
          <div className="card animate-slideUp" style={{
            width: 480, maxHeight: '80vh', overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>创建校招笔试批次</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 4 }}>批次名称</label>
                <input type="text" defaultValue="2026 春季校招 · AI 研发笔试" style={{
                  width: '100%', padding: '8px 12px', borderRadius: 6,
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-dark)',
                  color: 'var(--text-primary)', fontSize: 14,
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 4 }}>总时长 (分钟)</label>
                  <input type="number" defaultValue={45} style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-dark)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }} />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 4 }}>通过线</label>
                  <input type="number" defaultValue={65} style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-dark)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }} />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: 4 }}>导入候选人名单</label>
                <div style={{
                  border: '2px dashed var(--border-dark)', borderRadius: 8,
                  padding: '24px', textAlign: 'center', cursor: 'pointer',
                }}>
                  <p className="text-muted text-sm">拖拽 CSV 文件或点击上传</p>
                  <p className="text-xs text-muted mt-1">支持 .csv 格式 (姓名, 邮箱, 学校)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4" style={{ gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>取消</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                setShowCreateModal(false);
              }}>创建批次并生成链接</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
