import React, { useEffect, useState } from 'react';

import Header from '../Component/Header/Header';
import Signup from '../Component/Signup/Signup';
import Login from '../Component/Signup/Login';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [signin, setSignin] = useState(false);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/profile");
        };
    }, [user]);

    return (
        <>
            <Header />
            {
                !signin ? <Signup /> : <Login />
            }
            {
                !signin ?
                    (<p className='para' onClick={() => setSignin(!signin)}>Already Have An Account? Login.</p>) :
                    (
                        <p className='para' onClick={() => setSignin(!signin)}>Don't Have An Account? SignUp.</p>
                    )
            }
        </>
    );
};

export default SignUpPage;