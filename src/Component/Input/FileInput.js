import React, { useState } from 'react';
import "./input.css";

const FileInput = ({ className = 'custom-input',   accept, id, labelname, fileHandle }) => {
    const [file, SetFile] = useState("");

    const onchange = (e) => {
        SetFile(e.target.files[0].name);
        fileHandle(e.target.files[0]);
    };

    return (
        <>
            <input
                type="file"
                accept={accept}
                id={id}
                onChange={onchange}
                style={{ display: "none" }}
            />
            <label htmlFor={id} className={className}>
                {file ?
                    `${file} Selected` :
                    labelname
                }
            </label>
        </>
    );
};

export default FileInput;