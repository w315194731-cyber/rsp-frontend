import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import EditorPage from './pages/EditorPage';
import AuthPage from './pages/AuthPage';
import { ToastContainer, useToast } from './components/ui/Toast';

export default function App() {
  const { toasts, dismissToast } = useToast();

  return (
    <BrowserRouter>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="min-h-screen flex flex-col bg-bg-base">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}