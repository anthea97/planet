import React, { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../lib/hooks";
import Layout from "../../components/layout";

const AddEvent = () => {
  const router = useRouter();
  const user = useUser();
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [eventTime, setEventTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  const [eventLocation, setEventLocation] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventStatus, setEventStatus] = useState("confirmed");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [eventImgUrl, setEventImgUrl] = useState("/images/event3.jpeg");

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleSaveClick = async () => {
    if (
      !eventName ||
      !eventDescription ||
      !eventDate ||
      !eventTime ||
      !eventLocation ||
      !eventPrice ||
      !eventStatus ||
      !maxAttendees ||
      !eventImgUrl
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const eventDateObj = new Date(eventDate);
    const isoDateWithMidnightUTC = new Date(
      Date.UTC(
        eventDateObj.getFullYear(),
        eventDateObj.getMonth(),
        eventDateObj.getDate()
      )
    ).toISOString();

    const event = {
      eventName,
      eventDate: isoDateWithMidnightUTC,
      eventTime,
      eventLocation,
      eventStatus,
      maxAttendees: Number(maxAttendees),
      eventPrice: Number(eventPrice),
      eventImgUrl,
      eventOrg: user.username,
      eventDescription,
    };

    try {
      const response = await fetch(`/api/events`, {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        const responseJson = await response.json();
        console.log("Event saved:", responseJson);
        router.push("/admin-dashboard");
      } else if (response.status === 400) {
        const responseJson = await response.json();
        console.log("Failed to save the event:", responseJson);
        alert(responseJson.message);
      } else {
        console.log("Failed to save the event. Status code:", response.status);
      }
    } catch (error) {
      console.error("Failed to save the event:", error);
    }
  };

  const handleCancelClick = async () => {
    router.push("/admin-dashboard");
  };

  return (
    <Layout>
      <h1>Add Event</h1>

      <div className="add-field">
        <label htmlFor="eventName">Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventDescription">Description</label>
        <textarea
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventDate">Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventTime">Time</label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventLocation">Location</label>
        <input
          type="text"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventPrice">Price</label>
        <input
          type="number"
          value={eventPrice}
          onChange={(e) => setEventPrice(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventStatus">Status</label>
        <select
          value={eventStatus}
          onChange={(e) => setEventStatus(e.target.value)}
        >
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="add-field">
        <label htmlFor="maxAttendees">Maximum Attendees</label>
        <input
          type="number"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          required
        />
      </div>

      <div className="add-field">
        <label htmlFor="eventImgUrl">Image URL</label>
        <input
          type="text"
          value={eventImgUrl}
          onChange={(e) => setEventImgUrl(e.target.value)}
          required
        />
      </div>

      <div className="admin-buttons">
        <button onClick={() => handleSaveClick()}>Save Event</button>
        <button onClick={() => handleCancelClick()}>Cancel</button>
      </div>

      <style jsx>{`
        .add-field label {
          display: block;
          margin-bottom: 0.76rem;
          font-size: 1.1rem;
        }
        .admin-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        textarea {
          height: 100px;
          resize: vertical;
        }

        button {
          padding: 0.75rem 1rem;
          font-size: 1rem;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          //   background-color: #0056b3;
        }

        .add-field select {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          background-color: white;
          font-size: 1rem;
        }

        @media (max-width: 600px) {
          .admin-buttons {
            flex-direction: column;
          }

          input,
          textarea,
          button {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default AddEvent;
