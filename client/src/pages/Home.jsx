import React from 'react'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full
    bg-[url("/bg_img.png")] bg-cover bg-center bg-fixed'>
      <Header/>
    </div>
  )
}

export default Home
