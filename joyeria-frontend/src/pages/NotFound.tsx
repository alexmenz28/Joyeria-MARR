import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import RevealSection from '../components/common/RevealSection';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] font-sans flex items-center justify-center px-6">
      <Helmet>
        <title>Page not found — Joyeria MARR</title>
      </Helmet>
      <RevealSection className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-marrGold mb-3">404</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          This page does not exist or you do not have access to it.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-600 transition-colors"
        >
          Back to home
        </Link>
      </RevealSection>
    </div>
  );
}
