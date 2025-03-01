import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import { Documentation } from './pages/docs';
import DriverLanding from './pages/DriverLanding';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Support from './pages/Support';
import TicketDetails from './pages/support/TicketDetails';
import TrainingData from './pages/admin/TrainingData';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { trainingService } from './services/trainingService';
import './index.css';
import Favourites from './pages/Favourites';
import RideHistory from './pages/RideHistory';
import ActiveRides from './pages/ActiveRides';

// Initialize training service by loading from Supabase
trainingService.loadTrainingData()
  .then(() => {
    console.log('Training data loaded from Supabase successfully');
  })
  .catch((error) => {
    console.error('Error loading training data from Supabase:', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<App />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/driver">
            <Route index element={<DriverLanding />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="docs" element={
              <ErrorBoundary>
                <Documentation />
              </ErrorBoundary>
            } />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support/ticket/:id"
            element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <RideHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides"
            element={
              <ProtectedRoute>
                <ActiveRides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/training"
            element={
              <ProtectedRoute>
                <TrainingData />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
