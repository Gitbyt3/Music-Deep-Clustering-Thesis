import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBanner from '../components/top_banner'

const MainLayout = () => {
  return (
    <>
        <TopBanner />
        <Outlet />
    </>
  )
}

export default MainLayout