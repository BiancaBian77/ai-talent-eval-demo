import type { ExamBatch, Question, Candidate, ExamConfig } from '../types';

// ============ Mock Questions ============
export const mockQuestions: Question[] = [
  {
    id: 'q-a-1',
    type: 'A',
    title: '需求到交付：协作白板组件',
    description: `## 需求描述
实现一个简易的协作白板组件，支持多人实时编辑。

### 功能要求
1. **画布渲染** — 使用 Canvas 或 SVG 渲染无限画布
2. **绘图工具** — 支持画笔（3 种颜色）、矩形、圆形
3. **撤销/重做** — 支持操作历史回退
4. **实时同步** — 模拟 WebSocket 同步其他用户的操作

### 技术约束
- 使用 TypeScript
- 对 AI 工具的使用不做限制
- 代码需通过提供的测试用例`,
    timeLimit: 20,
    weight: 30,
    starterCode: `// Collaborative Whiteboard Component
// 请完成以下实现

interface Point {
  x: number;
  y: number;
}

type Tool = 'pen' | 'rect' | 'circle';
type Color = '#FF6B6B' | '#4ECDC4' | '#FFE66D';

interface DrawAction {
  tool: Tool;
  color: Color;
  points: Point[];
  id: string;
}

class Whiteboard {
  private actions: DrawAction[] = [];
  private undone: DrawAction[] = [];
  
  constructor(private canvas: HTMLCanvasElement) {
    this.initCanvas();
  }
  
  private initCanvas(): void {
    // TODO: 初始化画布监听
  }
  
  draw(action: DrawAction): void {
    // TODO: 执行绘制操作
  }
  
  undo(): DrawAction | null {
    // TODO: 撤销上一步操作
    return null;
  }
  
  redo(): DrawAction | null {
    // TODO: 重做已撤销操作
    return null;
  }
  
  broadcast(action: DrawAction): void {
    // TODO: 广播操作给其他用户
  }
  
  receiveRemote(action: DrawAction): void {
    // TODO: 接收远程操作并渲染
  }
}

export default Whiteboard;`,
    testCases: [
      { input: 'draw pen stroke', expected: 'renders stroke on canvas' },
      { input: 'undo after draw', expected: 'removes last action' },
      { input: 'redo after undo', expected: 'restores action' },
      { input: 'remote action received', expected: 'renders remote action' },
      { input: 'switch tool to rect', expected: 'draws rectangle' },
    ],
  },
  {
    id: 'q-b-1',
    type: 'B',
    title: 'AI 代码找茬：Review Dashboard',
    description: `## 场景
以下是一个 AI 生成的 Review Dashboard 组件代码。这个代码能跑通，但包含 **5 个隐藏问题**（性能、安全、逻辑、边界处理等）。

### 你的任务
1. 找出尽可能多的 Bug/问题
2. 为每个问题写出修复方案
3. 直接在代码中修改

### 提示
- 不止看语法错误，关注运行时行为
- 想想边界条件：空数据、大量数据、并发请求
- 检查安全漏洞`,
    timeLimit: 15,
    weight: 30,
    starterCode: `// AI-Generated Code - Find the bugs!
import React, { useState, useEffect } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export default function ReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const filteredReviews = reviews
    .filter(r => r.content.includes(search))
    .sort((a, b) => {
      if (sortOrder === 'desc') return b.rating - a.rating;
      return a.rating - b.rating;
    });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const deleteReview = (id: number) => {
    fetch('/api/reviews/' + id, { method: 'DELETE' });
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="dashboard">
      <h1>Review Dashboard</h1>
      <div className="stats">
        <p>Average Rating: {averageRating.toFixed(1)}</p>
        <p>Total Reviews: {reviews.length}</p>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search reviews..."
      />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sort {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
      <div className="review-list">
        {filteredReviews.map(review => (
          <div key={review.id} className="review-card">
            <h3>{review.author}</h3>
            <div className="rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
            <p>{review.content}</p>
            <span>{new Date(review.date).toLocaleDateString()}</span>
            <button onClick={() => deleteReview(review.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    aiBugs: [
      { line: 28, description: 'fetch 无错误处理' },
      { line: 34, description: 'includes 大小写敏感' },
      { line: 41, description: '除以零会导致 NaN' },
      { line: 44, description: '乐观删除无回滚' },
      { line: 45, description: '直接拼接用户输入到 URL (XSS risk)' },
    ],
  },
  {
    id: 'q-c-1',
    type: 'C',
    title: '方案评审：实时数据同步架构',
    description: `## 场景
团队提出用 WebSocket + Redis Pub/Sub 实现多端实时数据同步。

### 请评审以下方案，回答：

1. **可靠性** — 消息丢失怎么办？如何保证最终一致性？
2. **扩展性** — 万人同时在线的瓶颈在哪？
3. **安全性** — 有哪些潜在安全风险？
4. **替代方案** — 你会推荐什么替代方案？为什么？

### 方案简述
\`\`\`
Client A ──WS──> Server ──Redis Pub/Sub──> Server ──WS──> Client B
                                    │
                              ┌─────┴─────┐
                              │  Database  │
                              └───────────┘
\`\`\`
- 客户端通过 WebSocket 发送操作
- 服务端发布到 Redis Channel
- 其他服务端节点订阅并推送给各自客户端
- 最终写入 PostgreSQL`,
    timeLimit: 5,
    weight: 15,
    reviewScenario: '实时数据同步架构评审',
  },
  {
    id: 'q-d-1',
    type: 'D',
    title: '快速学习：WebAssembly 集成',
    description: `## 任务
你需要在 5 分钟内学习 WebAssembly 基础，并完成一个简单集成。

### 学习材料
WebAssembly (Wasm) 是一种二进制指令格式，可在浏览器中接近原生速度运行。Rust/C/C++ 代码可编译为 .wasm 文件，通过 JS API 调用。

### 你的任务
阅读以下 Rust 代码，将其编译思路转化为 JS 集成代码：

\`\`\`rust
// lib.rs - 将被编译为 wasm
#[no_mangle]
pub extern "C" fn fibonacci(n: i32) -> i32 {
    if n <= 1 { return n; }
    fibonacci(n - 1) + fibonacci(n - 2)
}

#[no_mangle]
pub extern "C" fn process_pixels(
    data: *mut u8, 
    len: usize, 
    brightness: f32
) {
    for i in 0..len {
        unsafe {
            *data.add(i) = (*data.add(i) as f32 * brightness).min(255.0) as u8;
        }
    }
}
\`\`\`

### 要求
1. 写出 JS 端加载和调用 Wasm 模块的代码
2. 说明 process_pixels 的应用场景
3. 指出这种方案相比纯 JS 实现的优势`,
    timeLimit: 5,
    weight: 25,
    learningMaterial: 'WebAssembly MDN Documentation',
  },
];

// ============ Mock Candidates ============
export const mockCandidates: Candidate[] = [
  { id: 'c-1', name: '张三', email: 'zhangsan@university.edu.cn', university: '清华大学', status: 'completed' },
  { id: 'c-2', name: '李四', email: 'lisi@university.edu.cn', university: '北京大学', status: 'completed' },
  { id: 'c-3', name: '王五', email: 'wangwu@university.edu.cn', university: '浙江大学', status: 'completed' },
  { id: 'c-4', name: '赵六', email: 'zhaoliu@university.edu.cn', university: '上海交大', status: 'completed' },
  { id: 'c-5', name: '孙七', email: 'sunqi@university.edu.cn', university: '复旦大学', status: 'completed' },
  { id: 'c-6', name: '周八', email: 'zhouba@university.edu.cn', university: '南京大学', status: 'in_progress' },
  { id: 'c-7', name: '吴九', email: 'wujiu@university.edu.cn', university: '华中科技', status: 'in_progress' },
  { id: 'c-8', name: '郑十', email: 'zhengshi@university.edu.cn', university: '武汉大学', status: 'pending' },
  { id: 'c-9', name: '冯十一', email: 'feng11@university.edu.cn', university: '中山大学', status: 'pending' },
  { id: 'c-10', name: '陈十二', email: 'chen12@university.edu.cn', university: '哈工大', status: 'pending' },
];

// ============ Mock Exam Config ============
export const mockExamConfig: ExamConfig = {
  id: 'batch-2026-spring',
  batchName: '2026 春季校招 · AI 研发笔试',
  type: 'campus',
  questions: mockQuestions,
  totalTime: 45,
  passLine: 65,
  status: 'active',
  createdAt: '2026-04-20T08:00:00Z',
  candidateCount: 10,
  completedCount: 5,
};

// ============ Mock Exam Batch ============
export const mockExamBatch: ExamBatch = {
  config: mockExamConfig,
  candidates: mockCandidates,
  results: [
    {
      candidate: mockCandidates[0],
      score: { l1: 88, l2: 82, total: 85, passed: true, breakdown: [
        { questionId: 'q-a-1', type: 'A', score: 85, maxScore: 100 },
        { questionId: 'q-b-1', type: 'B', score: 90, maxScore: 100 },
        { questionId: 'q-c-1', type: 'C', score: 80, maxScore: 100 },
        { questionId: 'q-d-1', type: 'D', score: 85, maxScore: 100 },
      ], l2Dimensions: { promptQuality: 4, debugIndependence: 4, taskDecomposition: 4, aiDependency: 2 } },
      behavior: { screenRecording: true, keystrokeCount: 3240, aiPromptCount: 18, codeChanges: 42, testRuns: 15, tabSwitches: 0, errorsEncountered: 3, aiChatLog: [], terminalLog: [], anomalyFlags: [] },
      rank: 1, percentile: 95,
    },
    {
      candidate: mockCandidates[1],
      score: { l1: 75, l2: 80, total: 77, passed: true, breakdown: [
        { questionId: 'q-a-1', type: 'A', score: 70, maxScore: 100 },
        { questionId: 'q-b-1', type: 'B', score: 85, maxScore: 100 },
        { questionId: 'q-c-1', type: 'C', score: 75, maxScore: 100 },
        { questionId: 'q-d-1', type: 'D', score: 70, maxScore: 100 },
      ], l2Dimensions: { promptQuality: 4, debugIndependence: 3, taskDecomposition: 4, aiDependency: 2 } },
      behavior: { screenRecording: true, keystrokeCount: 2890, aiPromptCount: 22, codeChanges: 35, testRuns: 12, tabSwitches: 0, errorsEncountered: 5, aiChatLog: [], terminalLog: [], anomalyFlags: [] },
      rank: 2, percentile: 82,
    },
    {
      candidate: mockCandidates[2],
      score: { l1: 68, l2: 70, total: 69, passed: true, breakdown: [
        { questionId: 'q-a-1', type: 'A', score: 65, maxScore: 100 },
        { questionId: 'q-b-1', type: 'B', score: 70, maxScore: 100 },
        { questionId: 'q-c-1', type: 'C', score: 60, maxScore: 100 },
        { questionId: 'q-d-1', type: 'D', score: 80, maxScore: 100 },
      ], l2Dimensions: { promptQuality: 3, debugIndependence: 3, taskDecomposition: 3, aiDependency: 3 } },
      behavior: { screenRecording: true, keystrokeCount: 2100, aiPromptCount: 30, codeChanges: 28, testRuns: 8, tabSwitches: 1, errorsEncountered: 8, aiChatLog: [], terminalLog: [], anomalyFlags: ['excessive_tab_switch'] },
      rank: 3, percentile: 68,
    },
    {
      candidate: mockCandidates[3],
      score: { l1: 55, l2: 60, total: 57, passed: false, breakdown: [
        { questionId: 'q-a-1', type: 'A', score: 50, maxScore: 100 },
        { questionId: 'q-b-1', type: 'B', score: 60, maxScore: 100 },
        { questionId: 'q-c-1', type: 'C', score: 55, maxScore: 100 },
        { questionId: 'q-d-1', type: 'D', score: 55, maxScore: 100 },
      ], l2Dimensions: { promptQuality: 3, debugIndependence: 2, taskDecomposition: 3, aiDependency: 4 } },
      behavior: { screenRecording: true, keystrokeCount: 1500, aiPromptCount: 45, codeChanges: 18, testRuns: 4, tabSwitches: 0, errorsEncountered: 12, aiChatLog: [], terminalLog: [], anomalyFlags: ['high_ai_dependency'] },
      rank: 4, percentile: 45,
    },
    {
      candidate: mockCandidates[4],
      score: { l1: 42, l2: 48, total: 45, passed: false, breakdown: [
        { questionId: 'q-a-1', type: 'A', score: 40, maxScore: 100 },
        { questionId: 'q-b-1', type: 'B', score: 50, maxScore: 100 },
        { questionId: 'q-c-1', type: 'C', score: 35, maxScore: 100 },
        { questionId: 'q-d-1', type: 'D', score: 45, maxScore: 100 },
      ], l2Dimensions: { promptQuality: 2, debugIndependence: 2, taskDecomposition: 2, aiDependency: 4 } },
      behavior: { screenRecording: true, keystrokeCount: 980, aiPromptCount: 55, codeChanges: 10, testRuns: 2, tabSwitches: 2, errorsEncountered: 15, aiChatLog: [], terminalLog: [], anomalyFlags: ['high_ai_dependency', 'suspicious_timing'] },
      rank: 5, percentile: 25,
    },
  ],
  stats: {
    total: 10,
    completed: 5,
    passed: 3,
    failed: 2,
    avgScore: 66.6,
    scoreDistribution: [
      { range: '0-20', count: 0 },
      { range: '20-40', count: 0 },
      { range: '40-60', count: 2 },
      { range: '60-80', count: 2 },
      { range: '80-100', count: 1 },
    ],
  },
};

// ============ AI Chat Simulator ============
export const aiResponses: Record<string, string[]> = {
  'collaborative whiteboard': [
    '好的，我来帮你设计协作白板的架构。首先我们需要处理 Canvas 的事件监听...\n\n```typescript\n// 基础事件绑定\nthis.canvas.addEventListener("mousedown", this.onMouseDown);\nthis.canvas.addEventListener("mousemove", this.onMouseMove);\nthis.canvas.addEventListener("mouseup", this.onMouseUp);\n```\n\n你打算用 Canvas 还是 SVG？Canvas 性能更好但需要自己维护状态。',
    '关于撤销/重做，我建议用 Command 模式。每个操作封装为 command 对象，维护一个 history stack：\n\n```typescript\ninterface Command {\n  execute(): void;\n  undo(): void;\n}\n```\n\n这样逻辑清晰，也方便序列化传输。',
    '实时同步部分，你可以模拟一个简单的广播机制。实际生产会用 CRDT 或 OT 算法，但笔试中简单广播即可。注意处理并发冲突——如果两个用户同时编辑同一区域怎么办？',
  ],
  'review dashboard': [
    '我注意到 fetch 没有 .catch() 处理网络错误。当 API 不可用时，用户会看到空白页面。建议添加错误状态和重试按钮。',
    '还有一个性能问题：每次输入搜索词都会对整个列表做 includes 过滤。对于大数据集，应该用防抖（debounce）优化。',
  ],
  default: [
    '我来帮你分析这个问题...',
    '让我看看你的代码结构，这里有几个可以优化的地方。',
    '不错的思路！不过还需要考虑边界条件。',
  ],
};

export function getAIResponse(context: string): string {
  for (const [key, responses] of Object.entries(aiResponses)) {
    if (context.toLowerCase().includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

// ============ Terminal Simulator ============
export const terminalOutputs: Record<string, string> = {
  'npm test': `PASS  tests/whiteboard.test.ts
  ✓ should render stroke on canvas (15ms)
  ✓ should undo last action (8ms)
  ✓ should redo undone action (5ms)
  ✓ should handle remote actions (12ms)
  FAIL  tests/whiteboard.test.ts
  ✕ should switch tools correctly (20ms)

Tests: 4 passed, 1 failed, 5 total
Time: 2.3s`,
  'npm run build': `> ai-talent-eval@0.1.0 build
> tsc && vite build

vite v6.x building for production...
✓ 42 modules transformed.
dist/index.html     0.45 kB
dist/assets/main.js 128.32 kB
✓ built in 1.8s`,
  'tsc --noEmit': `src/whiteboard.ts:45:7 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'Color'.

45   draw({ tool: 'pen', color: 'blue', points: [] });
         ~~~~~

Found 1 error.`,
  'node test.js': `Running test suite...
[1/5] Canvas initialization... ✓
[2/5] Draw operations... ✓
[3/5] Undo/Redo stack... ✓
[4/5] Remote sync... ✗
[5/5] Tool switching... ✓

Results: 4/5 passed. Duration: 1.2s`,
};
