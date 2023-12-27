import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../Component/Header/Header';
import EpisodeCard from '../Component/EpisodeCard/EpisodeCard';
import AudioPlayer from '../Component/AudioPlayer/AudioPlayer';

import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

const PodcastDetail = () => {
    const { id } = useParams();
    const [podcast, setPodcast] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [playingFile, setPlayingFile] = useState("");
    const navigate = useNavigate();

    

    useEffect(() => {
        //Get Data of One Podcast
    const getData = async () => {
        try {
            const docRef = doc(db, "podcasts", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPodcast({ id: id, ...docSnap.data() });
            } else {
                toast.error("No Such Podcast !");
                navigate("/podcast");
            };
        } catch (e) {
            toast.error(e.message);
        };
    };
        return () => {
            getData();
        };
    }, [id]);

    //Get data of Episodes
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts", id, "episodes")),
            (querySnapshot) => {
                const episodesData = [];
                querySnapshot.forEach((doc) => {
                    episodesData.push({ id: doc.id, ...doc.data() });
                });
                setEpisodes(episodesData);
            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            // getData();
            unsubscribe();
        };
    }, [id]);


    return (
        <div>
            <Header />
            <div className='podcastDetail-div'>
                {
                    podcast.id &&
                    <>
                        <div className='podCast-flex'>
                            <h1>{podcast.title}</h1>
                            {
                                podcast.uid === auth.currentUser.uid &&
                                <button onClick={() => { navigate(`/podcast/${id}/create-episode`) }}>Create Episode</button>
                            }
                        </div>
                        <div className='podcastDetailImagediv'>
                            <img src={podcast.bannerImage} alt="Banner" />
                        </div>
                        <p>{podcast.description}</p>
                        <h1>Episodes</h1>
                        {
                            episodes.length > 0 ?
                                <ol>
                                    {
                                        episodes.map((episode, index) =>
                                            <EpisodeCard key={index} onClick={(file) => setPlayingFile(file)} index={index + 1} title={episode.title} description={episode.description} audioFile={episode.audioFile} />
                                        )
                                    }
                                </ol> :
                                <>
                                    <p>No Episodes Found</p>
                                </>
                        }
                    </>
                }
            </div>
            {
                playingFile && <AudioPlayer audioSrc={playingFile} image={podcast.displayImage} />
            }
        </div>
    );
};

export default PodcastDetail;