import React from 'react';
import "./input.css";

const Input = ({ type, state, placeholder, required, setState }) => {
    return (
        <>
            <input
                type={type}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="custom-input" />
        </>
    );
};

export default Input;