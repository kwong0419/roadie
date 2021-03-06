import React, { useState } from "react";
import { storage } from "../../firebase";
import axios from "axios";
import { updateArtist } from "../token/artistTokenSlice";
import { toggleLoadingState } from "../Loading/loadingSlice";
import { useDispatch } from "react-redux";
import { apiURL } from "../../util/apiURL";
import { signUp } from "../../util/firebaseFunctions";
import "../../css/ArtistSignUpForm.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ArtistSignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const [pricing, setPricing] = useState("");
  const [contact_info, setContactInfo] = useState("");

  const [imageAsFile, setImageAsFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [toggleUploadMsg, setToggleUploadMsg] = useState(false);

  const API = apiURL();
  const dispatch = useDispatch();

  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  };

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    const types = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
    if (types.every((type) => image.type !== type)) {
      alert(`${image.type} is not a supported format`);
    } else {
      setImageAsFile((imageFile) => image);
    }
  };

  const handleFirebaseUpload = () => {
    if (imageAsFile === "") {
      alert("Please choose a valid file before uploading");
    } else if (imageAsFile !== null) {
      const uploadTask = storage
        .ref(`/images/${imageAsFile.name}`)
        .put(imageAsFile);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("images")
            .child(imageAsFile.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              setImageUrl(fireBaseUrl);
            });
        }
      );
      setToggleUploadMsg(true);
    } else {
      setToggleUploadMsg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await signUp(email, password);
      await axios.post(`${API}/artists`, {
        id: res.user.uid,
        name,
        profile_pic_url: imageUrl,
        bio,
        pricing,
        genre,
        city,
        contact_info: formatPhoneNumber(contact_info),
      });
      await axios.post(`${API}/users`, {
        id: res.user.uid,
        type: "artist",
      });
      dispatch(updateArtist(res.user));
      dispatch(toggleLoadingState());
      dispatch(toggleLoadingState());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="form-group">
      <div className="modal-header artistSignUpHeader">
        <h3 className="modal-title" id="exampleModalLongTitle">
          Artist Sign Up
        </h3>
      </div>
      <form onSubmit={handleSubmit} id="artistForm">
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelitem">
            Name
          </label>
          <input
            type="text"
            className="form-control artistSignUpInput"
            placeholder="Artist Name.."
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          ></input>
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelitem">
            Email
          </label>
          <div className="artistInput">
            <input
              type="email"
              className="form-control artistSignUpInput"
              placeholder="Artist Email.."
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            ></input>
          </div>

          <div className="form-group">
            <label for="exampleInputPassword1" id="labelitem">
              Password
            </label>
            <input
              type="password"
              className="form-control  artistSignUpInput"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            ></input>
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1" id="labelitem">
              Genre
            </label>
            <input
              type="text"
              className="form-control artistSignUpInput"
              placeholder="Artist Genre.."
              value={genre}
              onChange={(e) => setGenre(e.currentTarget.value)}
              required
            ></input>
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1" id="labelitem">
              Contact/Phone Number
            </label>
            <PhoneInput
              className="form-control artistSignUpInput"
              inputProps={{
                name: "contact_info",
                required: true,
                autoFocus: true,
              }}
              placeholder="Phone Number"
              country={"us"}
              value={contact_info}
              onChange={(contact_info) => setContactInfo(contact_info)}
            />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1" id="labelitem">
              Bio
            </label>
            <textarea
              type="text"
              className="form-control artistSignUpInput"
              placeholder="Artist Bio.."
              value={bio}
              rows="3"
              onChange={(e) => setBio(e.currentTarget.value)}
            />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1" id="labelitem">
              City
            </label>
            <input
              type="text"
              className="form-control artistSignUpInput"
              placeholder="Artist City.."
              value={city}
              onChange={(e) => setCity(e.currentTarget.value)}
            ></input>
          </div>
        </div>
        <div className="form-group artistUploadSignUp">
          <label for="exampleFormControlFile1" id="labelitem" className="labelArtistSignUp">
            Upload Profile Image
          </label>
          <input
            type="file"
            onChange={handleImageAsFile}
            required
            className="form-control-file artistFile"
            id="exampleFormControlFile1"
          />
        <button
          type="button"
          className="artistSignUploadButton btn-secondary"
          onClick={() => {
            handleFirebaseUpload();
          }}
          id="firebaseUpload"
        >
          Upload
        </button>
        <input
          type="submit"
          className="artistSignUpButton btn-primary"
          value="Sign Up"
          onClick={handleSubmit}
          data-dismiss="modal"
          aria-label="Close"
        />
        </div>

        {toggleUploadMsg ? (
          <h5 id="uploadSuccess" id="labelitem">
            Upload successful!
          </h5>
        ) : null}
      </form>
    </div>
  );
};

export default ArtistSignUpForm;
