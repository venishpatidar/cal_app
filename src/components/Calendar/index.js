import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@momentum-ui/core/css/momentum-ui.css";
import "../../styles/index.css";
import "react-datetime/css/react-datetime.css";
import { Button } from "@momentum-ui/react";
import { firestore } from "../../config/firebase-config";
import EventModal from "./EventModal";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AlertContainer, Alert } from "@momentum-ui/react";

const localizer = momentLocalizer(moment);

const Loading = (isVisible)=>{
  return(
    <div style={{display:isVisible?"none":'initial',position:'absolute',background:'rgba(0,0,0,0.4)',width:'100%',zIndex:10}}>
      <div className="spinner main">
        <i
          id="loading-spinner"
          className="md-spinner md-spinner--36 md-spinner--blue"
        />
        <p style={{color:'white'}} className="wait-message">Please wait, fetching data...</p>
      </div>
    </div>
  )
}

export default function Cal() {
  const [allEvents, setAllEvents] = useState([]);
  const [showCreateModal, setCreateModalStatus] = useState(false);
  const [showEditModal, setEditModalStatus] = useState(false);
  const [selectedEventObj, setSelectedEventObj] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [overLayLoading,setOverLayLoading] = useState(false)

  const [alertMessageArray,setAlertMessageArray] = useState({});
  const [alertKey,setAlertKey] = useState(0)
  const [alertKeyContainerRefresher,setAlertKeyContainerRefresher] = useState(0)
  const showAlertMessage = (type='info', message) => {
    alertMessageArray[alertKey] = {alertMessage:message,alertType:type}
    setAlertMessageArray(alertMessageArray)
    setAlertKey(alertKey+1)
  }


  const populatEventFunction = (currentMonth)=>{

    const Q = query(collection(firestore, "Events"), where("months", "array-contains", currentMonth));

    const unsubscribeEventListner = onSnapshot(
      Q,
      async (doc) => {
        if (doc.docs) {
          let arrfromobj = doc.docs.map((data) => {
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
          setAllEvents(resolved)
          setIsFetching(false);
          setOverLayLoading(false)
        } else {
          setAllEvents([]);
          setIsFetching(false);
          setOverLayLoading(false)
        }
      }
    );
    return unsubscribeEventListner;
  }
  useEffect( () => {
    const dt = new Date()
    return populatEventFunction(dt.getFullYear()+"-"+(dt.getMonth()))
  }, []);

  // to style the events
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event?.color,
      borderRadius: "5px",
      opacity: 1,
      color: "white",
      display: "block",
    };
    return { style };
  };

  if (isFetching) {
    return (
      <div className="spinner main">
        <i
          id="loading-spinner"
          className="md-spinner md-spinner--36 md-spinner--blue"
        />
        <p className="wait-message">Please wait, fetching data...</p>
      </div>
    );
  }

  return (
    <div className="main">
      <h1 className="heading">Cal App</h1>
      <div className="create-btn">
        <div className="row-end">
          <Button
            className="head"
            children="Create Event"
            onClick={() => setCreateModalStatus(true)}
            color="blue"
          />
          {(showCreateModal || showEditModal) && (
            <EventModal
              showCreateModal={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              showEditModal={showEditModal}
              setEditModalStatus={setEditModalStatus}
              selectedObj={selectedEventObj}
              showAlertMessage={showAlertMessage}
            />
          )}
        </div>
      </div>

      <Loading isVisible={overLayLoading} />

      <Calendar
        localizer={localizer}
        events={allEvents}
        onSelectEvent={(e) => {
          setSelectedEventObj(e);
          setEditModalStatus(true);
        }}
        onRangeChange={(range,view)=>{
          if(range.start || view==='month'){
            setOverLayLoading(true)
            var dt = new Date(range.start)
            dt.setDate(dt.getDate() + 8);
            return populatEventFunction(dt.getFullYear()+"-"+(dt.getMonth()))
          }
        
        }}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px", width: "80%" }}
        timeslots={1}
        eventPropGetter={eventStyleGetter}
        popup="true"
      />

      <AlertContainer key={alertKeyContainerRefresher}>
        {Object.entries(alertMessageArray).map((data,index)=>{
          return(
            <Alert
              key={index}
              closable
              message={data[1].alertMessage}
              dismissBtnProps={{
                onClick: () =>{
                  delete alertMessageArray[data[0]]
                  setAlertKeyContainerRefresher(alertKeyContainerRefresher?0:1)
                }
              }}
              type={data[1].alertType}
              show={true}
            />
          )
        })}
        
      </AlertContainer>
    </div>
  );
}
