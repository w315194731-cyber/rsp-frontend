export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="w-full max-w-[720px] mx-auto px-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-text-primary mb-8 text-center animate-fade-up"
        >
          About RSP Smart Editor
        </h1>

        <div className="space-y-6 text-base text-text-secondary leading-relaxed">
          <p className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            RSP Smart Editor is a browser-based AI tool built for photographers and e-commerce sellers who need reliable, scalable background removal without per-image pricing. We use open-source AI models (RMBG-1.4) to handle the heavy lifting — you just upload, click, and download.
          </p>

          <p className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            We believe AI tools should be affordable for solo creators, not just enterprises. Our pricing is designed to scale with you: free to start, flat-rate Pro plans for regular users, and a one-time Lifetime option for studios that want to cap costs permanently.
          </p>

          <div
            className="mt-10 p-6 bg-bg-surface border border-border-subtle rounded-lg animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Our Mission</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Make professional-grade AI image processing accessible to everyone — from independent photographers to growing e-commerce teams — without subscription fatigue or per-image pricing traps.
            </p>
          </div>

          <div
            className="p-6 bg-bg-surface border border-border-subtle rounded-lg animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4">Core Values</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">→</span>
                <span><strong className="text-text-primary">Privacy first</strong> — Files auto-delete after 24 hours. Your data is never stored long-term.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">→</span>
                <span><strong className="text-text-primary">Transparent pricing</strong> — No hidden fees, no per-image surprises.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">→</span>
                <span><strong className="text-text-primary">Open-source powered</strong> — We build on proven open AI models, not black-box services.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">→</span>
                <span><strong className="text-text-primary">Creator-friendly</strong> — Commercial rights on all paid plans. Use your outputs anywhere.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}