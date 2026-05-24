import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FcGoogle } from "react-icons/fc";

function AuthModal({ onClose }) {

    const { userData } = useSelector((state) => state.user)

    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [userData, onClose])

    return (
        <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-md px-4'>

            {/* modal card */}
            <div className='w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden'>

                {/* top accent */}
                <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>

                <div className='p-6 sm:p-8'>

                    {/* title */}
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
                        Welcome Back
                    </h1>

                    <p className='text-gray-500 text-sm sm:text-base mt-2 leading-relaxed'>
                        Continue your AI interview journey and unlock personalized feedback insights.
                    </p>

                    {/* feature chips */}
                    <div className='flex flex-wrap gap-2 mt-5'>
                        <span className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'>
                            AI Interviews
                        </span>
                        <span className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'>
                            Voice Based
                        </span>
                        <span className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600'>
                            Performance Analytics
                        </span>
                    </div>

                    {/* button */}
                    <button className='mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200 active:scale-[0.98]'>

                        <FcGoogle size={22} />
                        Continue with Google

                    </button>

                    {/* footer note */}
                    <p className='text-xs text-gray-400 text-center mt-5'>
                        Secure login powered by Firebase Authentication
                    </p>

                </div>
            </div>
        </div>
    )
}

export default AuthModal