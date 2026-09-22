import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageLoader } from '@/components/ui/PageLoader';
import { HomePage } from '@/pages/HomePage';

/* صفحه‌های داخلی به‌صورت تنبل بارگذاری می‌شوند تا باندل اولیه سبک بماند */
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ConsultantsPage = lazy(() => import('@/pages/ConsultantsPage').then((m) => ({ default: m.ConsultantsPage })));
const ConsultantPage = lazy(() => import('@/pages/ConsultantPage').then((m) => ({ default: m.ConsultantPage })));
const ToppersPage = lazy(() => import('@/pages/ToppersPage').then((m) => ({ default: m.ToppersPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const PostPage = lazy(() => import('@/pages/PostPage').then((m) => ({ default: m.PostPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ExamPage = lazy(() => import('@/pages/ExamPage').then((m) => ({ default: m.ExamPage })));
const MatchPage = lazy(() => import('@/pages/MatchPage').then((m) => ({ default: m.MatchPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const PanelPage = lazy(() => import('@/pages/PanelPage').then((m) => ({ default: m.PanelPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/consultants" element={<ConsultantsPage />} />
            <Route path="/consultants/:slug" element={<ConsultantPage />} />
            <Route path="/toppers" element={<ToppersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/exam/:examId" element={<ExamPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/panel" element={<PanelPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
