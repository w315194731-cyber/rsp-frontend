import Button from '../ui/Button';

interface BottomCTAProps {
  headline?: string;
  subheadline?: string;
}

export default function BottomCTA({
  headline = 'Ready to remove backgrounds at scale?',
  subheadline = 'Start for free — no credit card required.',
}: BottomCTAProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bg-surface to-bg-base">
      <div className="w-full max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 animate-fade-up">
          {headline}
        </h2>
        <p className="text-base text-text-secondary mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Button variant="primary" size="lg">
            Start Editing for Free
          </Button>
          <Button variant="secondary" size="lg">
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}