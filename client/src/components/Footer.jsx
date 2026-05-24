import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 py-10'>

      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 py-8 px-6 text-center">

        <div className='flex justify-center items-center gap-3 mb-4'>

          <div className='bg-black text-white p-3 rounded-xl shadow-sm'>
            <BsRobot size={18} />
          </div>

          <h2 className='font-semibold text-xl'>
            SakshatAI
          </h2>

        </div>

        <p className='text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed'>
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
        {/* Developer credit */}
<p className="mt-4 text-xs text-gray-400">
  Built by Charul Jain
</p>

      </div>

    </div>
  )
}

export default Footer