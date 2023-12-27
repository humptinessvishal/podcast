import React from 'react';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import { clearUser } from "../../Slices/UserSlice";

const LogOut = () => {
    const dispatch = useDispatch();
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
            toast.success("User logged Out !");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error(error.message);
        };
    };

    return (
        <>
            <button className='logoutbtn' onClick={handleLogout}>LogOut</button>
        </>
    );
};

export default LogOut;