import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { SignOutButton } from '@/components/SignOutButton';4

const RootLayout = async ({children} : {children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  return (
    <div className='root-layout'>
      <nav className="relative">
        <div className='flex flex-col gap-8 mb-2'>
          <div className='flex justify-between items-center relative'>
            <Link href="/" className='group flex items-center gap-3 transition-all duration-300 hover:scale-105'>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary-200/10 to-primary-300/10 p-2 rounded-lg border border-primary-200/20 group-hover:border-primary-200/40 transition-all duration-300">
                  <Image 
                    src="/logo.svg" 
                    alt="Mocksy Logo" 
                    width={32} 
                    height={32} 
                    className="filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                  />
                </div>
              </div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300'>
                Mocksy
              </h2>
            </Link>
            
            {isUserAuthenticated && (
              <div className="relative">
                <SignOutButton />
              </div>
            )}
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-primary-200/20 to-transparent"></div>
        </div>
        {children}
      </nav>
    </div>
  )
}

export default RootLayout