import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  axios.defaults.withCredentials=true;
  const navigate = useNavigate()
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = React.useRef([])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }


  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }


  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current){
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try{
      const code = otp.join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account',{ otp: code })
      if(data.success){
        toast.success(data.message || 'Email verified')
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message || 'Verification failed')
      }
    }catch(error){
      if (error.response) {
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`)
      } else if (error.request) {
        toast.error('Network error: Unable to connect to server')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 
    sm:px-0 bg-gradient-to-br from-blue-200 to-green-400'>
    <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 
    top-5 w-28 sm:32 cursor-pointer' />
    <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent</p>
      
      <div className='flex justify-center gap-3 mb-6' onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type='text'
            inputMode='numeric'
            pattern='[0-9]'
            maxLength='1'
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className='w-12 h-12 text-center text-xl font-bold text-white bg-[#333A5C] 
            border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none'
            required
          />
        ))}
      </div>
      
      <button
        type='submit'
        disabled={isLoading || otp.join('').length !== 6}
        className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 
        text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4'
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </button>
      
      <div className='text-center'>
        <button
          onClick={() => navigate('/login')}
          className='text-gray-400 hover:text-white text-sm'
        >
          Back to Login
        </button>
      </div>
    </form>
    </div>
  )
}

export default EmailVerify
