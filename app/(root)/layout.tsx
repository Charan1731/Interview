import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { SignOutButton } from '@/components/SignOutButton';

const RootLayout = async ({children} : {children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  return (
    <div className='root-layout'>
      <nav>
        <div className='flex flex-col gap-4 mb-10'>
          <div className='flex justify-between items-center'>
            <Link href="/" className='flex items-center gap-2'>
              <Image src="/logo.svg" alt="logo" width={38} height={38} />
              <h2 className='text-primary-100'>Mocksy</h2>
            </Link>
            {isUserAuthenticated && <SignOutButton />}
          </div>
          {/* {isUserAuthenticated && <NavLinks />} */}
        </div>
        {children}
      </nav>
    </div>
  )
}

export default RootLayout