import { Check } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  limitations?: string[];
  badge?: string;
  highlighted?: boolean;
  ctaLabel: string;
  ctaVariant?: 'primary' | 'secondary';
  onCheckout?: () => void;
  disabled?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  limitations,
  badge,
  highlighted = false,
  ctaLabel,
  ctaVariant = 'primary',
  onCheckout,
  disabled = false,
}: PricingCardProps) {
  return (
    <Card
      className={[
        'flex flex-col relative',
        highlighted
          ? 'border-2 border-brand shadow-glow-brand -translate-y-2'
          : '',
      ]
        .join(' ')
        .trim()}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant={badge === 'Limited' ? 'warning' : 'brand'}>{badge}</Badge>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-1">{name}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-text-primary">{price}</span>
        {period && (
          <span className="text-sm text-text-muted ml-1">{period}</span>
        )}
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check size={16} className="text-semantic-success mt-0.5 flex-shrink-0" strokeWidth={2} />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
        {limitations?.map((limitation) => (
          <li key={limitation} className="flex items-start gap-2.5 text-sm">
            <span className="text-text-disabled mt-0.5 flex-shrink-0">✕</span>
            <span className="text-text-disabled">{limitation}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={ctaVariant}
        size="md"
        className="w-full mt-auto"
        onClick={onCheckout}
        disabled={disabled}
      >
        {disabled ? 'Coming Soon' : ctaLabel}
      </Button>
    </Card>
  );
}