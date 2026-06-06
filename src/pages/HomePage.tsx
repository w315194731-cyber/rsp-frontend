import { Link } from 'react-router-dom';
import {
  Layers,
  Image,
  Sparkles,
  Zap,
  Download,
} from 'lucide-react';
import FeatureCard from '../components/features/FeatureCard';
import TrustBar from '../components/features/TrustBar';
import HowItWorks from '../components/features/HowItWorks';
import BottomCTA from '../components/features/BottomCTA';
import Button from '../components/ui/Button';

const features = [
  {
    icon: Layers,
    title: 'Batch Background Removal',
    description: 'Upload up to 200 files at once. AI processes every photo in seconds.',
  },
  {
    icon: Image,
    title: 'RAW File Support',
    description: 'Handles CR2, NEF, ARW, and other RAW formats alongside JPG, PNG, and WEBP.',
  },
  {
    icon: Sparkles,
    title: 'AI Denoising',
    description: 'Remove noise from low-light photos before or after background removal.',
  },
  {
    icon: Zap,
    title: 'One-Click Workflow',
    description: 'No manual masking — AI detects subject, separates background, outputs clean cutout.',
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Get transparent PNG or white JPG output; files auto-delete after 24 hours.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)',
          }}
        />
        <div className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-5">
            <h1
              className="text-4xl md:text-5xl font-bold text-text-primary leading-tight animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              Batch Background Removal for Professional Photographers & E-commerce Sellers
            </h1>
            <p
              className="text-lg text-text-secondary leading-relaxed animate-fade-up"
              style={{ animationDelay: '200ms', maxWidth: '480px' }}
            >
              One-click AI removes backgrounds from RAW files and product photos — batch-ready, watermark-free on paid plans.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: '350ms' }}
            >
              <Button variant="primary" size="lg">
                Start Free — No Credit Card Required
              </Button>
              <Link to="/#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: screenshot placeholder */}
          <div
            className="relative animate-fade-up rounded-xl overflow-hidden shadow-lg"
            style={{ animationDelay: '450ms' }}
          >
            <div className="bg-bg-surface border border-border-subtle rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-subtle flex items-center justify-center">
                <Layers size={32} className="text-brand" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-text-muted">RSP Smart Editor — Preview</p>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-bg-elevated border border-border-subtle" />
                <div className="w-8 h-8 rounded bg-bg-elevated border border-border-subtle" />
                <div className="w-8 h-8 rounded bg-bg-elevated border border-border-subtle" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="py-16 md:py-24">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Everything you need to edit at scale
            </h2>
            <p className="text-base text-text-secondary">
              Built for professional photographers and e-commerce teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}