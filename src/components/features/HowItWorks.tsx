import { Upload, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload',
    description: 'Drag and drop up to 200 images — RAW, JPG, PNG, or WEBP.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Processing',
    description: 'Our AI detects the subject and removes the background automatically.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download',
    description: 'Get transparent PNG or white JPG output, ready for any use.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-bg-elevated">
      <div className="w-full max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-brand-subtle border border-brand/20 flex items-center justify-center">
                  <Icon size={24} className="text-brand" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 text-xs font-mono font-bold text-brand bg-brand-subtle px-2 py-0.5 rounded-full">
                  {number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}