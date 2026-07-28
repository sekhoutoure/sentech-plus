'use client'
import React, { ReactNode } from 'react'
import StoreNavbar from './StoreNavbar'
import StoreSidebar from './StoreSidebar'

interface StoreLayoutProps {
  children: ReactNode
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <StoreNavbar />
      <div className="flex flex-1">
        <StoreSidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
