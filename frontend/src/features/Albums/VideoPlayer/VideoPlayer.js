import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { apiURL } from "../../../util/apiURL";
import ReactPlayer from "react-player";
import axios from "axios";
import BackButton from "../../BackButton/BackButton";
import "../../../css/VideoPlayer.css"

const VideoPlayer = () => {
  const [user, setUser] = useState({});
  const match = useRouteMatch();
  const API = apiURL();

  useEffect(() => {
    const fetchArtistVideo = async (artist_id, id) => {
      let res = await axios.get(
        `${API}/media/videos/artist/${artist_id}/video/${id}`
      );

      setUser(res.data.body.singleVideo);
    };
    fetchArtistVideo(match.params.artist_id, match.params.id);
  }, []);

  return (
    <div className="container VideoPlayer">
      <div>
        <BackButton />
      </div>
      <div className="jumbotron ClientVideoPlayerJumbo">
        <h1 className="clientCaptionVid">{user.caption}</h1>
        <ReactPlayer className="react-player" url={user.url} controls />
      </div>
    </div>
  );
};
export default VideoPlayer;
