
import { Button } from '@/components/ui/button';

interface AccountSidebarProps {
  onLogout: () => void;
}

export const AccountSidebar = ({ onLogout }: AccountSidebarProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-accent/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
        <div className="space-y-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={onLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
