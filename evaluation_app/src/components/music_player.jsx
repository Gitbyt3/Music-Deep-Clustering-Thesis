import React, { useState } from 'react';
import './music_player.css';

const TrackResults = ({ data }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const handlePlay = (url) => {
    if (currentlyPlaying && currentlyPlaying.src === url) {
      currentlyPlaying.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying) {
        currentlyPlaying.pause();
      }
      
      const audio = new Audio(url);
      audio.play();
      setCurrentlyPlaying(audio);
      
      audio.onended = () => setCurrentlyPlaying(null);
    }
  };

  return (
    <div className="track-results-container">
      <h2>Recommended Tracks</h2>
      <div className="tracks-list">
        {data.tracks.map((track, index) => (
          <div key={index} className={`track-card ${index === 0 ? 'best-match' : ''} ${index === data.tracks.length - 1 ? 'worst-match' : ''}`}>
            <div className="track-rank">
              <span className="rank-number">{index + 1}</span>
              {index === 0 && <span className="rank-label">Best Match</span>}
              {index === data.tracks.length - 1 && <span className="rank-label">Worst Match</span>}
            </div>
            
            <div className="track-main-info">
              <h3 className="track-title">{track.film_metadata.track_title}</h3>
              <div className="track-meta-row">
                <span><strong>Composer:</strong> {track.film_metadata.track_composer}</span>
                <span><strong>Film:</strong> {track.film_metadata.film_title} ({track.film_metadata.film_release_year})</span>
                <span><strong>Director:</strong> {track.film_metadata.film_director}</span>
                <span><strong>Genre:</strong> {track.film_metadata.film_genre}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handlePlay(track.audio.url)}
              className={`play-button ${currentlyPlaying && currentlyPlaying.src === track.audio.url ? 'playing' : ''}`}
            >
              {currentlyPlaying && currentlyPlaying.src === track.audio.url ? '❚❚' : '▶'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackResults;