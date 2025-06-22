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
        router.push('/');
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
      variant="outline" 
      className="group relative overflow-hidden border-2 border-primary-200/30 hover:border-primary-200 bg-transparent text-primary-200 font-bold px-6 py-2 rounded-full transition-all duration-300 hover:bg-primary-200/10 hover:scale-105"
      onClick={handleSignOut}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span>Sign Out</span>
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-primary-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
    </Button>
  );
}; 