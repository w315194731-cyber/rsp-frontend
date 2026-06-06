import { LucideIcon } from 'lucide-react';
import Card from '../ui/Card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card hoverable className="flex flex-col gap-3">
      <div className="w-10 h-10 rounded-lg bg-brand-subtle flex items-center justify-center">
        <Icon size={24} className="text-brand" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </Card>
  );
}