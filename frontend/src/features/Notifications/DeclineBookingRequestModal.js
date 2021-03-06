import React from "react";
import { db } from "../../firebase";

const DeclineBookingRequestModal = ({ artist_id, notification_id }) => {
  const handleDecline = async (e) => {
    e.preventDefault();
    await db
      .collection("bookings")
      .doc(artist_id)
      .collection("messages")
      .doc(notification_id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    window.location.reload();
  };

  return (
    <div
      className="modal fade"
      id="declineBookingRequestModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content logInModal">
          <div className="modal-header logInModalHeader">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Are you sure you want to decline?
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body loginModalBody">
            <form onSubmit={handleDecline}>
              <input
                type="submit"
                value="Yes"
                className="btn btn-primary roadieLogInButton"
                name="Click Here"
              />
            </form>
          </div>
          <div className="modal-footer loginModalBody">
            <button
              type="button"
              className="btn btn-secondary roadieLogInButton"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineBookingRequestModal;
