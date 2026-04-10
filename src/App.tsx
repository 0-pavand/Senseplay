import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { SettingsProvider } from './context/SettingsContext';
import { AchievementProvider } from './context/AchievementContext';
import { AchievementToast } from './components/AchievementToast';
import { Dashboard } from './pages/Dashboard';
import { GameDetail } from './pages/GameDetail';
import { LevelScreen } from './pages/LevelScreen';
import { FeedbackPage } from './pages/FeedbackPage';
import { StorePage } from './pages/StorePage';
import { CollectionPage } from './pages/CollectionPage';
import HearPlay  from './pages/HearPlay';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = localStorage.getItem('senseplay_logged_in') === 'true';
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <AchievementProvider>
          <HashRouter>
            <AchievementToast />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/app" element={<Navigate to="/" replace />} />
              <Route path="/game/:id" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
              <Route path="/game/:gameId/level/:levelId" element={<ProtectedRoute><LevelScreen /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
              <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
              <Route path="/hear-play" element={<ProtectedRoute><HearPlay /></ProtectedRoute>} />
            </Routes>
          </HashRouter>
        </AchievementProvider>
      </ProgressProvider>
    </SettingsProvider>
  );
}
