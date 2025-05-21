import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import About from './pages/About';
import ChatPage from './pages/ChatPage';
import Contact from './pages/Contact';
import EditProfilePage from './pages/EditProfilePage';
import ExplorePage from './pages/ExplorePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MessagesPage from './pages/MessagesPage';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetailPage';
import Privacy from './pages/Privacy';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import Term from './pages/Term';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-dark-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-800 text-gray-800 dark:text-gray-100 transition-colors duration-200">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy/>} />
            <Route path="/terms" element={<Term />} />
            <Route path="/contact" element={<Contact />} />
                    <Route path="/profile/:id" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
                    <Route path="/explore" element={<PrivateRoute><ExplorePage /></PrivateRoute>} />
                    <Route path="/post/:id" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
                    <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
                    <Route path="/messages/:userId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
                <ToastContainer position="top-right" autoClose={3000} />
              </div>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;