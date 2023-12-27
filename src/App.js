import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import { useDispatch } from 'react-redux';
import { setUser } from './Slices/UserSlice';

import PrivateRoutes from './Component/PrivateRoutes';
import SignUpPage from './Pages/SignUpPage';
import Profile from './Pages/Profile';
import CreatePodcastPage from './Pages/CreatePodcastPage';
import Podcasts from './Pages/Podcasts';
import PodcastDetail from './Pages/PodcastDetail';
import CreateAnEpisodePage from './Pages/CreateAnEpisodePage';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapShot = onSnapshot(
          doc(db, "users", user.uid), (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: userData.uid,
                  profilePic: userData.profilePic,
                })
              );
            };
          },
          (error) => {
            console.error("Error fetching User Data:", error);
          }
        );

        return () => {
          unsubscribeSnapShot();
        };
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-podcast' element={<CreatePodcastPage />} />
            <Route path='/podcasts' element={<Podcasts />} />
            <Route path='/podcast/:id' element={<PodcastDetail />} />
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisodePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;