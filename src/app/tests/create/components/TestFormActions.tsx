import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TestFormActionsProps {
  isLoading: boolean;
}

export function TestFormActions({ isLoading }: TestFormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--border-primary)]">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push('/tests')}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-[var(--accent-blue)] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Create Test
          </>
        )}
      </Button>
    </div>
  );
}
