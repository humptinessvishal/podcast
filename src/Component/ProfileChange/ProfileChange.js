import React, { useState } from 'react';
import "./profilechange.css";
import { toast } from 'react-toastify';
import { ImCross } from "react-icons/im";

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

import LogOut from '../LogOut/LogOut';
import FileInput from '../Input/FileInput';

const ProfileChange = ({ handleFlag, setLoading, user }) => {
    const [imageFile, SetImageFile] = useState("");

    const imageFileHandle = (file) => {
        SetImageFile(file);
    };

    const handleProfileChange = async () => {
        setLoading(true);
        if (imageFile) {
            try {
                const imageRef = ref(
                    storage, `profile/${Date.now()}`
                );
                await uploadBytes(imageRef, imageFile);
                const imageURL = await getDownloadURL(imageRef);

                await setDoc(doc(db, "users", user.uid), {
                    ...user,
                    profilePic: imageURL,
                });

                toast.success("Profile Image Changed");
                handleFlag()
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
                toast.error(e.message);
            };
        } else {
            toast.error("Choose Profile Image for Upload!");
            setLoading(false);
        };
    };

    return (
        <div className='profilechange'>
            <div>
                <p onClick={() => handleFlag()}><ImCross /></p>
                <FileInput className={"file"} fileHandle={imageFileHandle} accept={"image/*"} id={"user-image"} labelname={"Upload Profile Image *"} />
                <button onClick={handleProfileChange}>Submit</button>
                <LogOut/>
            </div>
        </div>
    );
};

export default ProfileChange;