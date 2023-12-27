import React from 'react';
import "./profilecard.css";

const ProfileCard = ({ user, onClick }) => {
    return (
        <div onClick={() => onClick()} className="profile-card">
            {
                user.profilePic ?
                    <img src={user.profilePic} alt="profile" /> :
                    <h1>No Image Found</h1>
            }
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    );
};

export default ProfileCard;