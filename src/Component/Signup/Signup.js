import React, { useState } from 'react';
import Input from '../Input/Input.js';
import FileInput from '../Input/FileInput.js';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from "../../firebase.js";
import { doc, setDoc } from 'firebase/firestore';

import { useDispatch } from 'react-redux';
import { setUser } from '../../Slices/UserSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Loader from '../Loader/Loader.js';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confpass, setConfpass] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileImageHandle = (file) => {
        setFile(file);
    };

    const handlesignup = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (password === confpass && password.length >= 6) {
            try {
                // Creating User's Account
                let imageURL = "";
                if (file) {
                    const imageRef = ref(storage, `profile/${Date.now()}`);
                    await uploadBytes(imageRef, file);
                    imageURL = await getDownloadURL(imageRef);
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Saving User's Account In Database
                await setDoc(doc(db, "users", user.uid), {
                    name: name,
                    email: user.email,
                    uid: user.uid,
                    profilePic: imageURL,
                });

                // Saving data in Redux
                dispatch(
                    setUser({
                        name: name,
                        email: user.email,
                        uid: user.uid,
                        profilePic: imageURL,
                    })
                );

                toast.success("User Signup Successful!");
                setLoading(false);
                navigate("/profile");
            } catch (error) {
                console.log(error.message);
                setLoading(false);
                toast.error(error.message);
            };
        } else {
            if (password !== confpass) {
                toast.error("Make Sure Password and Confirm Password are same!");
            } else if (password.length < 6) {
                toast.error("Password length is less than 6 character");
            };
            setLoading(false);
        };
    };

    return (
        <>
            <form onSubmit={handlesignup} className='wrapper-input'>
                <h1>SignUp</h1>
                {
                    !loading ?
                        (<>
                            <Input type="text" state={name} setState={setName} placeholder="Full Name *" required={true} />
                            <Input type="email" state={email} setState={setEmail} placeholder="Email *" required={true} />
                            <Input type="password" state={password} setState={setPassword} placeholder="Password * " required={true} />
                            <Input type="password" state={confpass} setState={setConfpass} placeholder="Confirm Password *" required={true} />
                            <FileInput fileHandle={profileImageHandle} accept={"image/*"} id={"Profile-image"} labelname={"Profile Image"} />
                            <button className='signup-btn' type='submit'> SignUp </button>
                        </>) :
                        <Loader/>
                }
            </form>
        </>
    );
};

export default Signup;