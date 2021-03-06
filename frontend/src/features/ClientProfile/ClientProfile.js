import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleClientContactModalState } from "../ClientContactForm/clientContactModalSlice";
import ClientPortfolio from "../Portfolio/ClientPortfolio";
import axios from "axios";
import { useHistory, useRouteMatch } from "react-router-dom";
import { apiURL } from "../../util/apiURL";
import logo from "../images/FinalRoadieLogoblk.png";
import "../../css/ClientProfile.css";
import moment from "moment";

const ClientProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [city, setCity] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [userEvents, setUserEvents] = useState([]);
  const [toggleEditEvents, setToggleEditEvents] = useState(false);
  const [eventOwnerId, setEventOwnerid] = useState(null);
  const client = useSelector((state) => state.client);
  const loading = useSelector((state) => state.loading);
  const API = apiURL();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.EventDisplay);
  const history = useHistory();

  useEffect(() => {
    const fetchUserInfo = async (id) => {
      let res = await axios.get(`${API}/clients/${id}`);
      let {
        name,
        profile_pic_url,
        bio,
        city,
        contact_info,
      } = res.data.body.single_client;
      setName(name);
      setProfilePicUrl(profile_pic_url);
      setBio(bio);
      setCity(city);
      setContactInfo(contact_info);
      setEventOwnerid(id);
    };
    fetchUserInfo(match.params.id);
  }, []);

  useEffect(() => {
    const fetchUserEvents = async (id) => {
      let res = await axios.get(`${API}/events/${id}`);
      setUserEvents(res.data.body.events);
    };
    fetchUserEvents(match.params.id);
  }, [userEvents]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEventDelete = async (id) => {
    try {
      await axios.delete(`${API}/events/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    toggleEditEvents ? setToggleEditEvents(false) : setToggleEditEvents(true);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const userEventsThumbs = userEvents.map((event) => {
    return (
      <div
        id={event.id}
        className={"eventThumb card-body row"}
        key={event.id}
        onClick={(e) =>
          history.push(`/event/${event.id}/client/${eventOwnerId}`)
        }
      >
        <img
          src={logo}
          alt="roadieLogo"
          width="50"
          height="50"
          class="d-inline-block align-top"
          id="roadieLogo"
        />
        <div class="eventListItemBody">
          <div className="eventHeading">
            <h5 class="card-title eventThumbCardText">{event.name}</h5>
            {toggleEditEvents ? (
              <img
                src="https://img.icons8.com/fluent/48/000000/delete-sign.png"
                alt="delete"
                id="deleteBttn"
                onClick={() => {
                  handleEventDelete(event.id);
                }}
              />
            ) : null}
          </div>
          <div className={"venueDateContainer"}>
            <p class="card-text eventThumbCardText">{event.venue}</p>
            <p class="card-text eventThumbCardText">
              {event.date.slice(0, 10)}
            </p>
            <p class="card-text eventThumbCardText">{event.address}</p>
            <p class="card-text eventThumbCardText">{event.city}</p>
          </div>
        </div>
      </div>
    );
  });
  let editButton = () => {
    if (client !== null && client.id === match.params.id) {
      return (
        <button
          type="button"
          class="btn btn-primary editClientProfile"
          data-toggle="modal"
          data-target="#editClientProfileModalCenter"
        >
          Edit Profile
        </button>
      );
    }
  };
  let createEventButton = () => {
    if (client !== null && client.id === match.params.id) {
      return (
        <div className="eventsButtonsDiv">
          <button
            id={"CreateEventButton"}
            className="btn btn-primary eventButtons"
            onClick={() =>
              history.push(`/client/${match.params.id}/createEvent`)
            }
          >
            Create Event
          </button>
          <button
            id={"CreateEventButton"}
            onClick={handleToggle}
            className="btn btn-primary eventButtons"
          >
            Edit Events
          </button>
        </div>
      );
    }
  };
  return (
    <>
      <div className="container">
        <div
          className="row artistBanner align-items-center justify-content-center"
          id="artistBanner"
        >
          <div className={"col-sm-2"}>
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#contactClientModalCenter"
              id="BookMeButton"
              onClick={() => dispatch(toggleClientContactModalState())}
            >
              Contact Me!
            </button>
          </div>
          <div className="col-sm-6 text-center artistProfileHeader">
            <h2 className={"artistProfileName"}>{name}</h2>
          </div>
          <div className="col-sm-2">{editButton()}</div>
        </div>
        {/* This page has two divs */}
        <div className="row portfolioDiv">
          <div className={"col"}>
            <ClientPortfolio />
          </div>
          <div className="col artistInfo">
            <div className={"infoDiv jumbotron"}>
              <div className={"cityDiv"}>
                <label className="labelInfo">City:</label>
                <h4 className={"city"}>{city}</h4>
              </div>
              <div className={"contactInfoDiv"}>
                <label className="labelInfo">Contact:</label>
                <h3 className={"contact"}>{contactInfo}</h3>
              </div>
              <div className={"bioDiv"}>
                <label className="labelInfo">About me:</label>
                <p className={"bioContent"}>{bio}</p>
              </div>
            </div>
            <div className={"bookingsDisplayContainer text-center"}>
              <div className={"eventTitleDiv"}>
                <h1 class="display-4">Created Events</h1>
                {/* <h3 className={"eventsTitle"}>Created Events</h3> */}
              </div>
              <div className={"createEventButtonDiv"}>
                {createEventButton()}
              </div>
              <div className={"eventUl"}>{userEventsThumbs}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "relative", minHeight: "200px" }}
      >
        <div
          class="toast"
          id="toastContact"
          style={{ position: "absolute", top: 0, right: 0, width: "300px" }}
          data-autohide={true}
          data-delay="5000"
        >
          <div class="toast-header">
            <img
              src={logo}
              class="rounded mr-2"
              alt="..."
              width="20"
              height="20"
            />
            <strong class="mr-auto">Roadie</strong>
            <small>{moment().calendar()}</small>
            <button
              type="button"
              class="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="toast-body">You sent a message to the client!</div>
        </div>
      </div>
    </>
  );
};

export default ClientProfile;
