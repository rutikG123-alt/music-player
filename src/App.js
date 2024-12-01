// src/App.js
import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import "./App.css";
import artistImage from "./michael_jackson.png";

function App() {
  const songs = [
    {
      id: 1,
      title: "Billie Jean",
      plays: "1,040,811,084",
      time: "5:35",
      album: "Thriller",
      audio: "./assets/billie_jean.mp3", // Replace with actual path
    },
    {
      id: 2,
      title: "Beat It",
      plays: "643,786,045",
      time: "4:23",
      album: "Thriller",
      audio: "./assets/beat_it.mp3", // Replace with actual path
    },
    {
      id: 3,
      title: "Smooth Criminal",
      plays: "590,223,084",
      time: "5.35",
      album: "Bad",
      audio: "./assets/smooth_criminal.mp3", // Replace with actual path
    },
    {
      id: 4,
      title: "Thriller",
      plays: "712,122,300",
      time: "3:51",
      album: "Thriller",
      audio: "./assets/dont_stop.mp3", // Replace with actual path
    },
    {
      id: 5,
      title: "Man in the Mirror",
      plays: "479,540,932",
      time: "4:52",
      album: "Bad",
      audio: "./assets/rock_with_you.mp3", // Replace with actual path
    },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const playSong = (index) => {
    if (window.currentHowl) {
      window.currentHowl.stop();
    }

    const sound = new Howl({
      src: [songs[index].audio],
      html5: true,
      onend: () => {
        if (isRepeat) {
          playSong(index); // Replay the same song
        } else if (isShuffle) {
          handleShuffle();
        } else {
          handleNext(); // Play the next song
        }
      },
      onload: () => setDuration(sound.duration()),
    });

    window.currentHowl = sound;
    sound.play();
    setIsPlaying(true);
    startProgressUpdater();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.currentHowl.pause();
    } else {
      window.currentHowl.play();
      startProgressUpdater();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    playSong(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex =
      currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    playSong(prevIndex);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(randomIndex);
    playSong(randomIndex);
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const startProgressUpdater = () => {
    const interval = setInterval(() => {
      if (window.currentHowl && isPlaying) {
        setProgress(window.currentHowl.seek());
      }
    }, 500);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    playSong(currentSongIndex);
    return () => {
      if (window.currentHowl) {
        window.currentHowl.stop();
      }
    };
  }, [currentSongIndex]);

  return (
    <div id="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="logo">DreamMusic</div>
          <div className="menu">
            <a href="#">Home</a>
            <a href="#">Trends</a>
            <a href="#">Library</a>
            <a href="#">Discover</a>
          </div>
        </div>
        <div className="general">
          <a href="#">Settings</a>
          <a href="#">Log Out</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <div>
            <a href="#">Music</a>
            <a href="#">Podcast</a>
            <a href="#">Live</a>
            <a href="#">Radio</a>
          </div>
          <input type="text" placeholder="Search" />
        </div>

        {/* Artist Section */}
        <div className="artist-section">
          <div className="info">
            <h2>Michael Jackson</h2>
            <p>27,852,501 monthly listeners</p>
          </div>
          <img src={artistImage} alt="Michael Jackson" />
        </div>

        {/* Song List */}
        <div className="song-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Plays</th>
                <th>Time</th>
                <th>Album</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr
                  key={song.id}
                  style={{
                    backgroundColor:
                      index === currentSongIndex ? "#ff4141" : "",
                  }}
                >
                  <td>{song.id}</td>
                  <td>{song.title}</td>
                  <td>{song.plays}</td>
                  <td>{song.time}</td>
                  <td>{song.album}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vertical Division */}
      <div className="right-panel">
        {/* Play Control Card */}
        <div className="control-card">
          <img src={artistImage} alt="Artist" className="artist-image" />
          <h3>Now Playing</h3>
          <p>{songs[currentSongIndex].title}</p>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(progress / duration) * 100}%` }}
            ></div>
          </div>
          <div className="buttons">
            <button onClick={handlePrevious}>⏮ </button>
            <button onClick={handlePlayPause}>
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button onClick={handleNext}>⏭</button>
          </div>
          <div className="mode-buttons">
            <button
              onClick={toggleRepeat}
              className={isRepeat ? "active-mode" : ""}
            >
              🔁 
            </button>
            <button
              onClick={toggleShuffle}
              className={isShuffle ? "active-mode" : ""}
            >
              🔀 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
