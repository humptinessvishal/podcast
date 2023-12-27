import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPodcast } from '../Slices/PodcastSlice';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

import Header from '../Component/Header/Header';
import PodcastCard from "../Component/PodcastCard/PodcastCard";
import Input from '../Component/Input/Input';

const Podcasts = () => {
    const dispatch = useDispatch();
    const podcastData = useSelector((state) => state.podcasts.podcasts);
    const [search, setSearch] = useState("");

    //Get Data of All Podcasts from db
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
            (querySnapshot) => {
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    podcastsData.push({ id: doc.id, ...doc.data() })
                });
                dispatch(setPodcast(podcastsData));
            },
            (error) => {
                console.log(error);
            }
        );
        return () => {
            unsubscribe();
        }
    }, [dispatch]);

    //For filtering Data by Title
    var filterPodcasts = podcastData.filter((item) =>
        item.title.trim().toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <div>
            <Header />
            <h1 style={{ textAlign: 'center' }}>Discover Podcasts</h1>
            <div style={{ textAlign: 'center' }}>
                <Input type="text" state={search} setState={setSearch} placeholder="Search By Title" />
            </div>
            {
                filterPodcasts.length > 0 &&
                <div className='card-div'>
                    {filterPodcasts.map((item, index) =>
                        <PodcastCard key={index + 1} id={item.id} title={item.title} displayImage={item.displayImage} />
                    )}
                </div>
            }
        </div>
    );
};

export default Podcasts;