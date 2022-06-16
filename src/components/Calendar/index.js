import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@momentum-ui/core/css/momentum-ui.min.css";
import "../styles/index.css";
import "react-datetime/css/react-datetime.css";
import { Button } from "@momentum-ui/react";
import { database } from "../../firebase-config";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import { onValue, ref, update } from "firebase/database";

const localizer = momentLocalizer(moment);

export default function Cal() {
  const [allEvents, setAllEvents] = useState([]);
  const [showCreateModal, setCreateModalStatus] = useState(false);
  const [showEditModal, setEditModalStatus] = useState(false);
  const [selectedEventObj, setSelectedEventObj] = useState({});

  const createEvent = (newEvent) => {
    const t = new Date();
    const events = ref(database, "Events/" + t.getTime());
    update(events, {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      description: newEvent.description,
      schedulertype: newEvent.schedulertype,
      // color:newEvent.color,
    })
      .then(() => {
        setCreateModalStatus(false);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    const All_events = ref(database, "Events/");
    onValue(All_events, async (snapshots) => {
      if (snapshots.exists()) {
        let arrfromobj = Object.entries(snapshots.val()).map((data, index) => {
          let obj = {
            id: data[0],
            title: data[1].title,
            start: new Date(data[1].start),
            end: new Date(data[1].end),
            description: data[1].description,
            schedulertype: data[1].schedulertype,
            // color: data[1].color,
          };
          return obj;
        });
        let resolved = await Promise.all(arrfromobj);
        setAllEvents(resolved);
      } else {
        setAllEvents([]);
      }
    });
  }, []);

  // const eventStyleGetter = () => {
  //   const style = {
  //     backgroundColor: "#265985",
  //     borderRadius: "5px",
  //     opacity: 1,
  //     display: "block",
  //     color: "white",
  //   };
  //   return { style };
  // };

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
        // eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}
