import React from 'react';
import "./episodeCard.css";

const EpisodeCard = ({ title, index, description, audioFile, onClick }) => {
    return (
        <div className='episode-card' key={index}>
            <h1>{index}. {title}</h1>
            <p>{description}</p>
            <button onClick={() => onClick(audioFile)}>Play</button>
        </div>
    );
};

export default EpisodeCard;