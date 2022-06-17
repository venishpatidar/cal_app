import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@momentum-ui/core/css/momentum-ui.min.css";
import "../styles/index.css";
import "react-datetime/css/react-datetime.css";
import { Button } from "@momentum-ui/react";
import { firestore } from "../../firebase-config";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import { addDoc, collection, onSnapshot } from "firebase/firestore";

const localizer = momentLocalizer(moment);

export default function Cal() {
  const [allEvents, setAllEvents] = useState([]);
  const [showCreateModal, setCreateModalStatus] = useState(false);
  const [showEditModal, setEditModalStatus] = useState(false);
  const [selectedEventObj, setSelectedEventObj] = useState({});

  const createEvent = (newEvent) => {
    addDoc(collection(firestore, "Events"), {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      schedulertype: newEvent.schedulertype,
      color:newEvent.color,
    })
    .then(() => {
      setCreateModalStatus(false);
    })
    .catch((error) => {
      alert(error.message);
    });
  };

  useEffect(() => {
    const unsubscribeEventListner = onSnapshot(collection(firestore, "Events"),async (doc) => {
        if (doc.docs) {
          let arrfromobj = doc.docs.map((data, index) => {
            let obj = {
              id: data.id,
              title: data.data().title,
              start: new Date(data.data().start),
              end: new Date(data.data().end),
              description: data.data().description,
              schedulertype: data.data().schedulertype,
              color: data.data().color,
            };
            return obj;
          });
          let resolved = await Promise.all(arrfromobj);
          setAllEvents(resolved);
      } else {
        setAllEvents([]);
      }
    });
    return unsubscribeEventListner;
  }, []);


  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event?.color,
      borderRadius: "5px",
      opacity: 1,
      display: "block",
      color: "white",
    };
    return { style };
  };

  return (
    <div>
      <h1 className="heading">Cal App</h1>
      <div className="btn">
        <div className="row">
          <Button
            className="head"
            children="Create Event"
            onClick={() => setCreateModalStatus(true)}
            color="blue"
          />
          {showCreateModal && (
            <CreateEvent
              showCreateModal={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              createEvent={createEvent}
            />
          )}
        </div>
      </div>
      {showEditModal && (
        <EditEvent
          showEditModal={showEditModal}
          setEditModalStatus={setEditModalStatus}
          selectedObj={selectedEventObj}
        />
      )}
      
      <Calendar
        localizer={localizer}
        events={allEvents}
        onSelectEvent={(e) => {
          setSelectedEventObj(e);
          setEditModalStatus(true);
        }}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "80px" }}
        timeslots={1}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}
