import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Input from '../Component/Input/Input';
import FileInput from './Input/FileInput';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Loader from './Loader/Loader';

const CreatePodcast = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const displayImageHandle = (file) => {
        setDisplayImage(file);
    };

    const bannerImageHandle = (file) => {
        setBannerImage(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (title && desc && displayImage && bannerImage) {
            try {
                //Upload bannerImage and displayImage in Storage and get File Url
                const bannerImageref = ref(
                    storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(bannerImageref, bannerImage);
                const bannerImageUrl = await getDownloadURL(bannerImageref);

                const displayImageref = ref(
                    storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(displayImageref, displayImage);
                const displayImageUrl = await getDownloadURL(displayImageref);

                const podcastData = {
                    title: title,
                    description: desc,
                    bannerImage: bannerImageUrl,
                    displayImage: displayImageUrl,
                    uid: auth.currentUser.uid,
                };
                //Set podcastData in db with help of File Url
                await addDoc(collection(db, "podcasts"), podcastData);
                            
                toast.success("Uploaded Files");
                setLoading(false);
                navigate("/podcasts");
            } catch (e) {
                console.log(e);
                setLoading(false);
                toast.error(e.message);
            };
        } else {
            toast.error("Please Enter All Values!");
            setLoading(false);
        };
    };

    return (
        <div className='wrapper-input'>
            <h1>Create A Podcast</h1>
            {
                !loading ?
                    (<>
                        <Input type="text" state={title} setState={setTitle} placeholder="Podcast Title *" required={true} />
                        <Input type="text" state={desc} setState={setDesc} placeholder="Podcast Description *" required={true} />
                        <FileInput fileHandle={bannerImageHandle} accept={"image/*"} id={"banner-image"} labelname={"Banner Image"} />
                        <FileInput fileHandle={displayImageHandle} accept={"image/*"} id={"display-image"} labelname={"Display Image"} />
                        <button className='signup-btn' onClick={handleSubmit} >Create Now</button>
                    </>) :
                    <Loader/>
            }
        </div>
    );
};

export default CreatePodcast;