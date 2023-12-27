import React from 'react';
import "./podcastCard.css";
import { Link } from 'react-router-dom';

const PodcastCard = ({ id, title, displayImage }) => {
    return (
        <Link className='link' to={`/podcast/${id}`}>
            <div className="podcast-card" >
                <img src={displayImage} alt="display" />
                <p>{title}</p>
            </div>
        </Link>
    );
};

export default PodcastCard;