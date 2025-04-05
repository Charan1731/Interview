"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, Video } from 'lucide-react';

const NavLinks = () => {
  const pathname = usePathname();

  const links = [
    { 
      href: '/', 
      label: 'Home', 
      icon: <Home className="w-4 h-4" /> 
    },
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: <BarChart3 className="w-4 h-4" /> 
    },
    { 
      href: '/interview', 
      label: 'Interview', 
      icon: <Video className="w-4 h-4" /> 
    }
  ];

  return (
    <div className="flex space-x-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary-500/20 text-primary-300' 
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks; 