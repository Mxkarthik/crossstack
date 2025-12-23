import React from 'react'
import { createContext } from 'react'
import { useState } from 'react';
import {server} from '../main.jsx'
import axios from 'axios';
import { useEffect } from 'react';
import { useContext } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth , setIsAuth] = useState(false);

    async function fetchUserData() {
        setLoading(true);
        try {
            const {data} = await axios.get(`${server}/api/v1/me`, {withCredentials: true});

            setUser(data);
            setIsAuth(true);
        }
        catch (error) {
            console.log("Error fetching user data:", error);
        }finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchUserData();
    },[]);
    return (
        <AppContext.Provider value={{ setIsAuth, isAuth, user, setUser,loading}}>
            {children}
        </AppContext.Provider>
    );
};

export const AppData = () => {
    const context = useContext(AppContext);

    if(!context) throw new Error("AppData must be used within AppProvider");
    return context;
}