import React, { useState } from 'react';
import Input from '../Input/Input';
import Loader from '../Loader/Loader';

import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

import { useDispatch } from 'react-redux';
import { setUser } from '../../Slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reset = () => {
        setLoading(true);
        if (email) {
            sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                toast.success("Password reset email sent!");
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
        } else {
            toast.error("Please Give Correct Email !");
            setLoading(false);
        };
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (password.length >= 6) {
            try {
                // Login User's Account
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Getting User's Data From Database
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.data();

                // Saving data in Redux
                dispatch(
                    setUser({
                        name: userData.name,
                        email: user.email,
                        uid: user.uid,
                        profilePic: userData.profilePic,
                    })
                );
                toast.success("User Login Successful!");
                setLoading(false);
                navigate("/profile");
            } catch (error) {
                console.log(error.message);
                setLoading(false);
                toast.error(error.message);
            };
        } else {
            toast.error("Make Sure Password is correct !");
            setLoading(false);
        };
    };

    return (
        <>
            <form onSubmit={handleLogin} className='wrapper-input'>
                <h1>Log In</h1>
                {
                    !loading ?
                        (<>
                            <Input type="email" state={email} setState={setEmail} placeholder="Email *" required={true} />
                            <Input type="password" state={password} setState={setPassword} placeholder="Password *" required={true} />
                            <button className='signup-btn' type='submit'>Log In</button>
                            <p className='para' onClick={reset}>Reset Password</p>
                        </>) :
                        <Loader/>
                }
            </form>
        </>
    );
};

export default Login;