import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthForm from '../components/ui/AuthForm';

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://rsp-workers.w315194731.workers.dev';

export default function AuthPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="bg-bg-surface border border-border-subtle rounded-radius-xl p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-brand" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">Check your inbox</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We sent a magic link to your email. Click the link in the message to sign in.
                The link expires in 10 minutes.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-brand hover:text-brand-hover transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-1">Sign in</h2>
                <p className="text-sm text-text-secondary">
                  Enter your email and we'll send you a magic link — no password needed.
                </p>
              </div>

              <AuthForm onSubmit={handleSubmit} />

              {error && (
                <p className="mt-4 text-sm text-semantic-error text-center">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}