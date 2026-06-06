import Button from '../ui/Button';
import Input from '../ui/Input';

interface AuthFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading?: boolean;
}

export default function AuthForm({ onSubmit, loading }: AuthFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (email) await onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoFocus
          disabled={loading}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {loading ? 'Sending link...' : 'Send magic link'}
      </Button>
    </form>
  );
}