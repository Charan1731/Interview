import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const RootLayout = ({children} : {children: ReactNode}) => {
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
          <Image src="/logo.svg" alt="logo" width={38} height={38} />
          <h2 className='text-primary-100'>TechRonin</h2>
        </Link>
        {children}
      </nav>
    </div>
  )
}

export default RootLayout