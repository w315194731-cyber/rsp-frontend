import PricingCard from '../components/features/PricingCard';
import BottomCTA from '../components/features/BottomCTA';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For photographers exploring AI batch processing — free, no credit card required.',
    features: [
      'Up to 5 images per day',
      'No batch size limit on upload',
      'Small watermark on output',
      'PNG and JPG output',
    ],
    limitations: [
      'Daily quota resets every 24h',
      'Priority queue access',
    ],
    ctaLabel: 'Get Started Free',
    ctaVariant: 'secondary' as const,
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/month',
    description: 'For photographers handling weekly shoots and e-commerce sellers processing 200+ photos per month.',
    features: [
      '200 images per batch',
      'Unlimited batches per month',
      'No watermark',
      'Priority queue',
      'Commercial usage rights',
      'Cancel anytime — no lock-in',
    ],
    badge: 'Most Popular',
    highlighted: true,
    ctaLabel: 'Start Pro',
    disabled: true,
  },
  {
    name: 'Lifetime',
    price: '$299',
    period: 'one-time',
    description: 'For studios and power users who want to cap costs permanently — limited to 200 early adopters.',
    features: [
      '1,000 images per batch',
      'Unlimited batches forever',
      'No monthly fees',
      'No watermark',
      'Priority queue',
      'Commercial usage rights',
    ],
    limitations: [
      'Fair Use: ~1,000 images/month average',
      'Overage billed at $0.001/image',
    ],
    badge: 'Limited',
    ctaLabel: 'Claim Lifetime Offer',
    ctaVariant: 'secondary' as const,
    disabled: true,
  },
];

const faqs = [
  {
    q: 'What file formats do you support?',
    a: 'JPG, PNG, WEBP, and RAW formats including CR2, NEF, and ARW. Output is PNG (transparent) or JPG (white background).',
  },
  {
    q: "How does the free tier work?",
    a: "Free gives you 5 images per day with a small watermark on output. No credit card required to start. Quota resets every 24 hours.",
  },
  {
    q: "What's the difference between Pro and Lifetime?",
    a: "Pro is a monthly subscription ($14.99/mo or $119/yr) with 200 images/batch. Lifetime is a one-time $299 purchase with 1,000 images/batch and no monthly fees — limited to the first 200 buyers.",
  },
  {
    q: 'Can I use RSP for client work?',
    a: 'Yes. All paid plans include commercial usage rights. Your outputs are yours to use in client deliverables, e-commerce listings, or print.',
  },
  {
    q: 'What happens to my images after processing?',
    a: 'All uploaded files are automatically deleted from our servers 24 hours after processing. We don\'t store your images long-term.',
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 animate-fade-up">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base text-text-secondary animate-fade-up" style={{ animationDelay: '100ms' }}>
            No per-image fees. No surprises. Choose the plan that fits your workflow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-bg-elevated">
        <div className="w-full max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-text-primary mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-border-subtle pb-6">
                <h3 className="text-base font-semibold text-text-primary mb-2">{q}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </div>
  );
}