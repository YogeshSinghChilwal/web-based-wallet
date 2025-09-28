import React from 'react'
import { ThemeToggle } from './theme-toggle'

const Navbar = () => {
  return (
    <div>
        <nav className="flex items-center justify-between p-4">
            <div className="text-2xl font-bold">Web3 Wallet</div>
            <div className="flex items-center space-x-4">
            <ThemeToggle animationDuration={500} />
            </div>
        </nav>
      
      
    </div>
  )
}

export default Navbar
