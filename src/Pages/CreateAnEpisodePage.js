import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../Component/Header/Header';
import Input from '../Component/Input/Input';
import FileInput from '../Component/Input/FileInput';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Loader from '../Component/Loader/Loader';

const CreateAnEpisodePage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const audioFileHandle = (file) => {
    setAudioFile(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (id && title && desc && audioFile) {
      try {
        //Upload AudioFile in Storage and get File Url
        const audioFileRef = ref(
          storage, `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(audioFileRef, audioFile);
        const audioFileUrl = await getDownloadURL(audioFileRef);

        const episodeData = {
          title: title,
          description: desc,
          audioFile: audioFileUrl,
        };
        //Save Data in database
        await addDoc(collection(db, "podcasts", id, "episodes"), episodeData);
        toast.success("Episode Created Successfully");
        setLoading(false);
        navigate(`/podcast/${id}`);

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
    <div>
      <Header />
      <div className='wrapper-input'>
        <h1>Create An Episode</h1>
        {
          !loading ?
            (<>
              <Input type="text" state={title} setState={setTitle} placeholder="Title *" required={true} />
              <Input type="text" state={desc} setState={setDesc} placeholder="Description *" required={true} />
              <FileInput fileHandle={audioFileHandle} accept={"audio/*"} id={"audio-file-input"} labelname={"Upload Audio File *"} />
              <button className='signup-btn' onClick={handleSubmit} >Create Now</button>
            </>) :
            <Loader/>
        }
      </div>
    </div>
  );
};

export default CreateAnEpisodePage;