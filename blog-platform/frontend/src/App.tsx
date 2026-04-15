import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const EditPost = React.lazy(() => import('./pages/EditPost'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const About = React.lazy(() => import('./pages/About'));

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Toast />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <Dashboard />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CreatePost />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <EditPost />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <PostDetail />
                </React.Suspense>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Profile />
                </React.Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <Settings />
                  </React.Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <About />
              </React.Suspense>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
