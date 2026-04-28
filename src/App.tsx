import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HRDashboard from './pages/HRDashboard';
import CandidateEntry from './pages/CandidateEntry';
import Sandbox from './pages/Sandbox';
import Submission from './pages/Submission';
import HRResults from './pages/HRResults';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HRDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/hr/results/:batchId" element={<HRResults />} />
        <Route path="/exam/:examId" element={<CandidateEntry />} />
        <Route path="/exam/:examId/sandbox" element={<Sandbox />} />
        <Route path="/exam/:examId/submission" element={<Submission />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
