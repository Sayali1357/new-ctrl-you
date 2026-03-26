import React, { ReactNode } from 'react'

const Authlayout = ({children}:{children: ReactNode}) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  )
}

export default Authlayout
