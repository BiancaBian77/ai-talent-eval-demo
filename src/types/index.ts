// ============ AI Talent Evaluation - Type Definitions ============

export type QuestionType = 'A' | 'B' | 'C' | 'D';
export type BatchStatus = 'draft' | 'active' | 'closed';
export type CandidateStatus = 'pending' | 'in_progress' | 'completed' | 'passed' | 'failed';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  timeLimit: number; // minutes
  weight: number;
  starterCode?: string;
  testCases?: { input: string; expected: string }[];
  aiBugs?: { line: number; description: string }[]; // for Type B
  reviewScenario?: string; // for Type C
  learningMaterial?: string; // for Type D
}

export interface ExamConfig {
  id: string;
  batchName: string;
  type: 'campus' | 'social';
  questions: Question[];
  totalTime: number;
  passLine: number;
  status: BatchStatus;
  createdAt: string;
  candidateCount: number;
  completedCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  university?: string;
  status: CandidateStatus;
  examId?: string;
  startTime?: string;
  endTime?: string;
  score?: CandidateScore;
  behaviorData?: BehaviorData;
}

export interface CandidateScore {
  l1: number;      // 自动判分 0-100
  l2: number;      // AI行为分析 0-100
  total: number;   // L1*0.5 + L2*0.5
  passed: boolean;
  breakdown: {
    questionId: string;
    type: QuestionType;
    score: number;
    maxScore: number;
  }[];
  l2Dimensions: {
    promptQuality: number;    // 1-5
    debugIndependence: number; // 1-5
    taskDecomposition: number; // 1-5
    aiDependency: number;     // 1-5 (lower = better)
  };
}

export interface BehaviorData {
  screenRecording: boolean;
  keystrokeCount: number;
  aiPromptCount: number;
  codeChanges: number;
  testRuns: number;
  tabSwitches: number;
  errorsEncountered: number;
  aiChatLog: ChatMessage[];
  terminalLog: TerminalEntry[];
  anomalyFlags: string[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface TerminalEntry {
  command: string;
  output: string;
  timestamp: string;
}

export interface ExamResult {
  candidate: Candidate;
  score: CandidateScore;
  behavior: BehaviorData;
  rank?: number;
  percentile?: number;
}

export interface ExamBatch {
  config: ExamConfig;
  candidates: Candidate[];
  results: ExamResult[];
  stats: {
    total: number;
    completed: number;
    passed: number;
    failed: number;
    avgScore: number;
    scoreDistribution: { range: string; count: number }[];
  };
}
