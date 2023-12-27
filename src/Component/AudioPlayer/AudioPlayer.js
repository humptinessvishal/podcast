import React, { useEffect, useRef, useState } from 'react';
import "./audioPlayer.css";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";

const AudioPlayer = ({ audioSrc, image }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        };
    }, [isPlaying,audioSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    useEffect(() => {
        if (!isMute) {
            audioRef.current.volume = volume;
        } else {
            audioRef.current.volume = 0;
        };
    }, [isMute, volume]);

    useEffect(() => {
        if (volume === '0') {
            setIsMute(true);
        } else {
            setIsMute(false);
        };
    }, [volume]);

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
        };
    };

    const toggleMute = () => {
        if (isMute) {
            setIsMute(false);
        } else {
            setIsMute(true);
        };
    };

    const handleVolume = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    };

    const handleDuration = (e) => {
        setCurrentTime(e.target.value);
        audioRef.current.currentTime = e.target.value;
    };

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const handleSkip = () => {
        audioRef.current.currentTime -= 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleForward = () => {
        audioRef.current.currentTime += 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={audioSrc} />
            <img src={image} className="player-image" alt='player' />
            <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <div className="time-info">
                <button onClick={handleSkip}><IoPlayBack /></button>
                <span className="current-time">{formatTime(currentTime)}</span>
                <input className="duration-bar" value={currentTime} type="range" min="0" max={duration} step="0.01" onChange={handleDuration} />
                <span className="remaining-time">-{formatTime(duration - currentTime)}</span>
                <button onClick={handleForward}><IoPlayForward /></button>
            </div>
            <button onClick={toggleMute}>{isMute ? <FaVolumeMute /> : <FaVolumeUp />}</button>
            <input className="sound-bar" value={volume} type="range" min="0" max="1" step="0.1" onChange={handleVolume} />
        </div>
    );
};

export default AudioPlayer;