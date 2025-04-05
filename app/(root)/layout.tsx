import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/SignOutButton';

const RootLayout = async ({children} : {children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated){
    redirect("/sign-in");
  }

  return (
    <div className='root-layout'>
      <nav>
        <div className='flex justify-between items-center mb-10'>
          <Link href="/" className='flex items-center gap-2'>
            <Image src="/logo.svg" alt="logo" width={38} height={38} />
            <h2 className='text-primary-100'>TechRonin</h2>
          </Link>
          <SignOutButton />
        </div>
        {children}
      </nav>
    </div>
  )
}

export default RootLayout