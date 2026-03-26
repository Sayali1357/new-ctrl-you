import Navbar from '@/components/navabar'
//import Section from '@/components/Section'
import React, { ReactNode } from 'react'
 
 const Authlayout = ({children}:{children: ReactNode}) => {
   return (
    <>
        <Navbar/>
        <div>{children}</div>
    </>
    
   )
 }
 
 export default Authlayout