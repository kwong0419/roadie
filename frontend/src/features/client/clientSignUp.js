import React, { useState } from "react";
import { storage } from "../../firebase";
import { apiURL } from "../../util/apiURL";
import { signUp } from "../../util/firebaseFunctions";
import { updateClient } from "../token/clientTokenSlice";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../../css/clientSignUp.css";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toggleLoadingState } from "../Loading/loadingSlice";

const ClientSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [contact_info, setContactInfo] = useState("");
  const history = useHistory();

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
      await axios.post(`${API}/clients`, {
        id: res.user.uid,
        name: name,
        profile_pic_url: imageUrl,
        bio,
        company,
        city,
        contact_info: formatPhoneNumber(contact_info),
      });
      await axios.post(`${API}/users`, {
        id: res.user.uid,
        type: "client",
      });
      dispatch(updateClient(res.user));
      dispatch(toggleLoadingState());
      dispatch(toggleLoadingState());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="form-group">
      <div className="modal-header clientSignUpHeader">
        <h3 className="modal-title" id="exampleModalLongTitle">
          Client Sign Up
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelItem">
            Name
          </label>
          <input
            type="text"
            className="form-control clientSignUpInput"
            placeholder={"Client Name.."}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelItem">
            Email
          </label>
          <input
            type="email"
            className="form-control clientSignUpInput"
            placeholder="Client Email.."
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1" id="labelItem">
            Password
          </label>
          <input
            type="password"
            className="form-control clientSignUpInput"
            placeholder={"Client Password.."}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            id="exampleInputPassword1"
          />
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelItem">
            City
          </label>
          <input
            type="text"
            className="form-control clientSignUpInput"
            placeholder="Client City.."
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
          />
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelItem">
            Contact Info/Phone Number
          </label>
          <PhoneInput
            className="form-control clientSignUpInput"
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
          <label for="exampleInputEmail1" id="labelItem">
            Company
          </label>
          <input
            type="text"
            className="form-control clientSignUpInput"
            placeholder={"Client Company.."}
            value={company}
            onChange={(e) => setCompany(e.currentTarget.value)}
          />
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1" id="labelItem">
            Bio
          </label>
          <textarea
            type="text"
            className="form-control clientSignUpInput"
            placeholder="Client Bio.."
            value={bio}
            onChange={(e) => setBio(e.currentTarget.value)}
            row="3"
          />
        </div>
        <div className="form-group clientUploadSignUp">
          <label for="exampleFormControlFile1" id="labelItem" className="labelClientSignUp">
            Upload Profile Image
          </label>
          <input
            type="file"
            className="form-control-file clientFile"
            id="exampleFormControlFile1"
            required
            onChange={handleImageAsFile}
          />
          <button
            type="button"
            className="clientSignSignUploadButton btn-secondary"
            onClick={handleFirebaseUpload}
            id="firebaseUpload"
          >
            Upload
          </button>
          <input
            type="submit"
            className="clientSignUpButton btn-primary"
            value="Sign Up"
            onClick={handleSubmit}
            data-dismiss="modal"
            aria-label="Close"
          />
        </div>
        {toggleUploadMsg ? <h5 id="labelItem">Upload successful!</h5> : null}
      </form>
    </div>
  );
};
export default ClientSignUp;
