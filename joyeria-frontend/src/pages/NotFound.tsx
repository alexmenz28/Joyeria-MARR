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
        <p className="mb-8 text-muted">
          This page does not exist or you do not have access to it.
        </p>
        <Link to="/" className="btn-marr inline-block">
          Back to home
        </Link>
      </RevealSection>
    </div>
  );
}
