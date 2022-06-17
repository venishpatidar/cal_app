import React, { useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectOption,
} from "@momentum-ui/react";

function CreateEvent(props) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    schedulertype: "",
    color:"#000000",
  });

  return (
    <Modal
      applicationId="sandbox-scheduler"
      onHide={() => props.setCreateModalStatus(false)}
      show={props.showCreateModal}
      size="small"
      htmlId="modal1"
      backdropClickExit
    >
      <ModalHeader headerLabel="Create Event" showCloseButton />
      <ModalBody>
        <div className="container">
          <label>Title</label>
          <div className="flex-container">
            <Input
              className="input"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
        </div>
        <div className="container">
          <label>Start Date</label>
          <div className="flex-container">
            <Datetime
              dateFormat="DD/MM/YYYY"
              className="start-date"
              selected={newEvent.start}
              onChange={(start) =>{
                setNewEvent({ ...newEvent, start: new Date(start) .getTime()})
              }}
            />
          </div>
        </div>
        <div className="container">
          <label>End Date</label>
          <div className="flex-container">
            <Datetime
              dateFormat="DD/MM/YYYY"
              className="end-date"
              selected={newEvent.end}
              onChange={(end) =>
                setNewEvent({ ...newEvent, end: new Date(end) .getTime() })
              }
            />
          </div>
        </div>
        <div className="container">
          <label className="desc">Description</label>
          <div className="flex-container ">
            <div className="medium-10 des">
              <textarea
                selected={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        </div>
        <div className="container last">
          <label className="type">Type</label>
          <div className="flex-container">
            <Select
              defaultValue="Select Scheduler"
              className="select"
              selected={newEvent.schedulertype}
              value={newEvent.selected}
              onSelect={(e) => {
                setNewEvent({ ...newEvent, schedulertype: e[0].value });
              }}
            >
              <SelectOption value="scheduler1" label="scheduler1" />
              <SelectOption value="scheduler2" label="scheduler2" />
              <SelectOption value="scheduler3" label="scheduler3" />
            </Select>
          </div>
        </div>
        <div className="container color">
          <label className="col">Event Color</label>
          <div className="flex-container">
            <Input
              className="col-field"
              type="color"
              value={newEvent.color}
              onChange={(e) => {
                setNewEvent({ ...newEvent, color: e.target.value });
              }}
              style={{ marginRight: "20px", marginLeft: "5px" }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          children="Close"
          onClick={() => props.setCreateModalStatus(false)}
          color="default"
        />
        <Button
          children="Create"
          type="submit"
          color="blue"
          onClick={() => props.createEvent(newEvent)}
        />
      </ModalFooter>
    </Modal>
  );
}

export default CreateEvent;
