import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "../styles/HomePage.css";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    fetch(`${API_URL}/videos`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setVideos(data.results);
        } else {
          setError("No videos found. Displaying default videos.");
          setVideos(getDummyVideos());
        }
      })
      .catch(() => {
        setError("Error fetching videos. Displaying default videos.");
        setVideos(getDummyVideos());
      });
  };

  const getDummyVideos = () => [
    {
      video_id: "1",
      title: "Sample Video",
      ai_generated_title: "Hope In The Waiting",
      ai_generated_description: "Inspirational message about patience.",
      streaming_url: "https://d1l4ip8v5ktt0n.cloudfront.net/sample.m3u8",
      tags: ["Hope", "Faith"],
      explicit_content: false,
      transcription: "This is a sample video transcript.",
    },
    {
      video_id: "2",
      title: "Godly Ambition",
      ai_generated_title: "The Power of Faith",
      ai_generated_description: "Stay motivated with faith.",
      streaming_url: "https://d1l4ip8v5ktt0n.cloudfront.net/sample2.m3u8",
      tags: ["Ambition", "Faith"],
      explicit_content: true,
      transcription: "This is another sample video transcript.",
    },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      fetchVideos();
      return;
    }

    fetch(`${API_URL}/search?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setVideos(data.results);
        } else {
          setError("No search results found.");
        }
      })
      .catch(() => setError("Error fetching search results."));
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("video", file);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        console.log("Upload successful", data);

        await fetch(`${API_URL}/analyze/${data.video_id}`, { method: "GET" });
        fetchVideos();
      } catch (error) {
        console.error("Error uploading video", error);
      }
    };
    input.click();
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
          value={searchQuery}
        />
        <button className="upload-button" onClick={handleUploadClick}>
          Upload Video
        </button>
      </div>

      {selectedVideo && (
        <div className="main-video-container">
          <ReactPlayer
            url={selectedVideo.streaming_url}
            controls
            playing
            width="100%"
            height="500px"
          />
          <div className="video-info">
            <h2 className="video-title">
              {selectedVideo.ai_generated_title || selectedVideo.title}
            </h2>
            <p className="video-description">
              {selectedVideo.ai_generated_description || selectedVideo.description}
            </p>
            {selectedVideo.explicit_content && (
              <p className="explicit-warning">⚠️ Explicit Content</p>
            )}
            <div className="video-tags">
              {selectedVideo.tags.map((tag, index) => (
                <span key={index} className="tag-button">
                  {tag}
                </span>
              ))}
            </div>
            {selectedVideo.transcription && (
              <div className="video-transcription">
                <h3>Transcription:</h3>
                <p>{selectedVideo.transcription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.video_id} className="video-item" onClick={() => setSelectedVideo(video)}>
            <ReactPlayer url={video.streaming_url} light controls width="100%" height="200px" />
            <div className="video-details">
              <h3 className="video-card-title">
                {video.ai_generated_title || video.title}
              </h3>
              <p className="video-card-description">
                {video.ai_generated_description || video.description}
              </p>
              <div className="video-card-tags">
                {video.tags.map((tag, index) => (
                  <span key={index} className="card-tag">
                    {tag}
                  </span>
                ))}
              </div>
              {video.explicit_content && <p className="explicit-warning">⚠️ Explicit Content</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
