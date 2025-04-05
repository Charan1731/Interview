'use client';

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await signOut();
      
      if (response.success) {
        toast.success(response.message);
        router.push('/sign-in');
      } else {
        toast.error(response.message || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('An error occurred while signing out');
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="btn-primary"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}; 