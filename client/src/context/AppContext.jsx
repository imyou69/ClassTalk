import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContent = createContext()

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '')
    console.log('Backend URL:', backendUrl)
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            } else {
                setIsLoggedin(false)
                setUserData(false)
            }
        }catch(error){
            setIsLoggedin(false)
            setUserData(false)
            // Don't show error toast for auth check failures
        }
    }

    useEffect(()=>{
        getAuthState();
    }, [])

    const getUserData = async()=>{
        try{
            console.log('Fetching user data from:', backendUrl + '/api/user/data')
            const{data} = await axios.get(backendUrl + '/api/user/data')
            console.log('User data response:', data)
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch(error){
            console.error('getUserData Error:', error)
            if (error.response) {
                
                toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
            } else if (error.request) {
                
                toast.error('Network error: Unable to fetch user data');
            } else {
                
                toast.error('An unexpected error occurred while fetching user data');
            }
        }
    }

    const logout = async()=>{
        try{
            axios.defaults.withCredentials = true 
            const {data} = await axios.post(backendUrl + '/api/auth/logout')
            if(data.success){
                setIsLoggedin(false)
                setUserData(false)
                toast.success(data.message || "Logged out successfully")
            } else {
                toast.error(data.message || "Logout failed")
            }
        }catch(error){
            console.error('Logout error:', error)
            // Even if logout fails on server, clear local state
            setIsLoggedin(false)
            setUserData(false)
            toast.error(error.response?.data?.message || error.message || "Logout failed")
        }
    }

    const value ={
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        logout
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}