import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/layout/Shell';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import MyChallengesPage from './pages/MyChallengesPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import AddEntryPage from './pages/AddEntryPage';
import InstitutionsPage from './pages/InstitutionsPage';
import InstitutionProfilePage from './pages/InstitutionProfilePage';
import SearchPage from './pages/SearchPage';
import FollowListPage from './pages/FollowListPage';

function Protected({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="grid place-items-center h-screen text-ink-500 text-sm">Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<Protected><Shell /></Protected>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/u/:id" element={<CreatorProfilePage />} />
        <Route path="/u/:id/followers" element={<FollowListPage mode="followers" />} />
        <Route path="/u/:id/following" element={<FollowListPage mode="following" />} />
        <Route path="/challenges" element={<MyChallengesPage />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="/challenges/:id/add" element={<AddEntryPage />} />
        <Route path="/institutions" element={<InstitutionsPage />} />
        <Route path="/institutions/:id" element={<InstitutionProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
