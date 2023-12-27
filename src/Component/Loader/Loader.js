import React from 'react';
import { PropagateLoader } from 'react-spinners';
import "./loader.css"

const Loader = () => {
    return (
        <div className='loader'>
            <PropagateLoader
                color="#8f8297"
                size={28}
                speedMultiplier={1.5}
            />
        </div>
    );
};

export default Loader;