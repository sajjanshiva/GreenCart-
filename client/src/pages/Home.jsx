import BestSeller from '@/components/bestSeller'
import BottomBanner from '@/components/BottomBanner'
import Categories from '@/components/Categories'
import MainBanner from '@/components/MainBanner'
import NewsLetter from '@/components/NewsLetter'
import React from 'react'

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  )
}

export default Home
