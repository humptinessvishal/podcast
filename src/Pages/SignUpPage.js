import React, { useState } from 'react';

import Header from '../Component/Header/Header';
import Signup from '../Component/Signup/Signup';
import Login from '../Component/Signup/Login';

const SignUpPage = () => {
    const [signin, setSignin] = useState(false);
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