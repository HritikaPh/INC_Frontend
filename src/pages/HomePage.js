import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "../styles/HomePage.css";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.example.com/videos") // Replace with actual API URL
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        } else {
          setError("No videos found. Displaying default videos.");
          setVideos([
            {
              id: 1,
              title: "Hope In The Waiting",
              description: "Inspirational message about patience.",
              src: "https://d1l4ip8v5ktt0n.cloudfront.net/cfbb607b-0d04-48e2-86bc-47fdd49b0128/AppleHLS1/2a54914f-794f-4b8a-b5c0-a81c92e55218.m3u8",
              tags: ["Hope", "Faith"],
            },
            {
              id: 2,
              title: "Godly Ambition",
              description: "Stay motivated with faith.",
              src: "https://d1l4ip8v5ktt0n.cloudfront.net/92667945-e072-4c2f-952b-72d2f007f4b9/AppleHLS1/avatar.m3u8",
              tags: ["Ambition", "Faith"],
            },
          ]);
        }
      })
      .catch(() => {
        setError("Error fetching videos. Displaying default videos.");
        setVideos([
          {
            id: 1,
            title: "Hope In The Waiting",
            description: "Inspirational message about patience.",
            src: "https://d1l4ip8v5ktt0n.cloudfront.net/cfbb607b-0d04-48e2-86bc-47fdd49b0128/AppleHLS1/2a54914f-794f-4b8a-b5c0-a81c92e55218.m3u8",
            tags: ["Hope", "Faith"],
          },
          {
            id: 2,
            title: "Godly Ambition",
            description: "Stay motivated with faith.",
            src: "https://d1l4ip8v5ktt0n.cloudfront.net/92667945-e072-4c2f-952b-72d2f007f4b9/AppleHLS1/avatar.m3u8",
            tags: ["Ambition", "Faith"],
          },
        ]);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div className="homepage">
      <h1 className="page-title">VedStream</h1>

      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Search for a video..."
          className="search-bar"
          onChange={handleSearch}
        />
      </div>

      {selectedVideo && (
        <div className="main-video-container">
          <ReactPlayer
            url={selectedVideo.src}
            controls
            playing
            width="100%"
            height="500px"
          />
          <div className="video-info">
            <h2 className="video-title">{selectedVideo.title}</h2>
            <p className="video-description">{selectedVideo.description}</p>
            <div className="video-tags">
              {selectedVideo.tags.map((tag, index) => (
                <span key={index} className="tag-button">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="video-grid">
        {videos
          .filter(
            (video) =>
              video.title.toLowerCase().includes(searchQuery) ||
              video.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
          )
          .map((video) => (
            <div key={video.id} className="video-item" onClick={() => setSelectedVideo(video)}>
              <ReactPlayer url={video.src} light controls width="100%" height="200px" />
              <div className="video-details">
                <h3 className="video-card-title">{video.title}</h3>
                <p className="video-card-description">{video.description}</p>
                <div className="video-card-tags">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;