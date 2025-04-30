
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AccountSidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };
  
  return (
    <div className="bg-accent/5 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
      <div className="space-y-2">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};
