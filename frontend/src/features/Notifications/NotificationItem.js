import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../css/NotificationItem.css";
import axios from "axios";
import { apiURL } from "../../util/apiURL";

const NotificationItem = ({ notification }) => {
  const artist = useSelector((state) => state.artist);
  const client = useSelector((state) => state.client);
  const API = apiURL();
  const [isArtist, setIsArtist] = useState(null);
  const [clientID, setClientID] = useState("");
  const [artistID, setArtistID] = useState("");

  const toggleArtist = () => {
    if (notification.data.eventDetails) {
      setClientID(notification.client_id);
      setArtistID(artist.id);
      setIsArtist(true);
    } else if (notification.data.name) {
      // setClientID(client.id);
      // setArtistID(notification.data.artist_id);
      setIsArtist(false);
    }
  };

  useEffect(() => {
    toggleArtist();
  }, []);

  let {
    message,
    bio,
    body,
    email,
    number,
    eventDetails,
    name,
    selectedEvent,
  } = notification.data;

  const handleAccept = async () => {
    try {
      let res = await axios.post(`${API}/bookings/`, {
        artist_id: artistID,
        client_id: clientID,
        event_id: selectedEvent,
        // bio,
        // contact_info,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = () => {};

  return (
    <>
      {isArtist ? (
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{message}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{bio}</h6>
            <p className="card-text">{body}</p>
            <ul>
              <h5>Event details:</h5>
              <li>
                <p className="card-text">Name: {eventDetails?.name}</p>
              </li>
              <li>
                <p className="card-text">Venue: {eventDetails?.venue}</p>
              </li>
              <li>
                <p className="card-text">Address: {eventDetails?.address}</p>
              </li>
              <li>
                <p className="card-text"> City: {eventDetails?.city}</p>
              </li>
              <li>
                <p className="card-text">Date: {eventDetails?.date}</p>
              </li>
            </ul>
            <h6 className="card-subtitle mb-2 text-muted">Contact Info:</h6>
            <p className="card-text">{number}</p>
            <p className="card-text">{email}</p>
          </div>
          <div className="buttonsDiv">
            <button
              type="button"
              class="btn btn-primary acceptBtn"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              type="button"
              class="btn btn-primary declineBtn"
              onClick={handleDecline}
            >
              Decline
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{message}</h5>
            <h6 className="card-subtitle mb-2 text-muted">Name: {name}</h6>
            <p className="card-text">{body}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationItem;
