import { WalletMinimal } from 'lucide-react'
import React from 'react'

const NavTitle = () => {
  return (
    <div className='flex items-center justify-baseline'>
        <h1 className='text-lg font-medium'>Flowt</h1>
        <WalletMinimal className='size-4' />
    </div>

  )
}

export default NavTitle