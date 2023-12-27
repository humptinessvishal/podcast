import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Component/Header/Header';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase';
import PodcastCard from '../Component/PodcastCard/PodcastCard';
import ProfileCard from '../Component/ProfileCard/ProfileCard';
import ProfileChange from '../Component/ProfileChange/ProfileChange';
import Loader from '../Component/Loader/Loader';


const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const [podcast, setPodcast] = useState([]);

  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const handleFlag = () => {
    flag ? setFlag(false) : setFlag(true);
  };

  useEffect(() => {
    const fetchDocs = async () => {
      const q = query(
        collection(db, "podcasts"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot.docs.map((doc) => (
        {
          id: doc.id,
          ...doc.data(),
        }
      ));
      setPodcast(docsData);
    };
    if (user) {
      fetchDocs();
    }
  }, [user]);

  if (!user) {
    return <Loader/>
  };

  return (
    <div>
      <Header />
      {
        !loading ?
          (<div className={`profile ${flag ? 'paused' : ''}`}>
            <ProfileCard onClick={handleFlag} user={user} />
            {flag &&
              <>
                <ProfileChange handleFlag={handleFlag} setLoading={setLoading} user={user} />
              </>
            }
            <h1 style={{ textAlign: "center" }}>Your Podcasts</h1>
            <div className='card-div'>
              {podcast.length === 0 ? (
                <p style={{ fontSize: "1.2rem" }}>You Have Zero Podcasts</p>
              ) : (
                <>
                  {
                    podcast.map((podcast, index) => (
                      <PodcastCard key={index + 1} id={podcast.id} title={podcast.title} displayImage={podcast.displayImage} />
                    ))
                  }
                </>
              )}
            </div>
          </div>) :
          <Loader/>
      }
    </div>
  );
};

export default Profile;