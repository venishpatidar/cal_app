import {
    deleteDoc,
    doc,
    updateDoc,
    addDoc,
    collection,
  } from "firebase/firestore";
  import moment from "moment";
  import { firestore } from "../config/firebase-config";
  
  export const schedulerOption = {
    sandbox: { name: "Sandbox", color: "blue" },
  };
  
  export const convertToUTC = (dateTime) => {
    return Number(moment(dateTime).utc().format("x"));
  };
  
  // firebase CRUD
  
  const getMonthsInBetween = (fromDate, toDate) => {
    const fromYear = fromDate.getFullYear();
    const fromMonth = fromDate.getMonth();
    const toYear = toDate.getFullYear();
    const toMonth = toDate.getMonth();
    const months = [];
    for(let year = fromYear; year <= toYear; year++) {
      let month = year === fromYear ? fromMonth : 0;
      const monthLimit = year === toYear ? toMonth : 11;
      for(; month <= monthLimit; month++) {
        months.push(year+"-"+month)
      }
    }
    return months;
  }

  export const addEvent = async (newEvent) => {

    addDoc(collection(firestore, "Events"), {
      ...newEvent,
      end: convertToUTC(newEvent.end),
      start: convertToUTC(newEvent.start),
      months:getMonthsInBetween(new Date(newEvent.start) ,new Date(newEvent.end)),
      color: schedulerOption[newEvent.schedulertype]?.color,
    });
  };
  
  export const updateEvent = async (event, id) => {
    updateDoc(doc(firestore, "Events", id), {
      ...event,
      end: convertToUTC(event.end),
      start: convertToUTC(event.start),
      color: schedulerOption[event.schedulertype]?.color,
    });
  };
  
  export const deleteEvent = async (id) => {
    deleteDoc(doc(firestore, "Events", id));
  };