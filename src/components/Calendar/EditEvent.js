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
import { ref, remove, update } from "firebase/database";
import { database } from "../../firebase-config";

export default function EditEvent(props) {
  const [title, setTitle] = useState(props.selectedObj.title);
  const [start, setStart] = useState(new Date(props.selectedObj.start));
  const [end, setEnd] = useState(new Date(props.selectedObj.end));
  const [description, setDescription] = useState(props.selectedObj.description);
  const [type, setType] = useState(props.selectedObj.type);
  return (
    <Modal
      applicationId="sandbox-scheduler"
      onHide={() => props.setCreateModalStatus(false)}
      show={props.showEditModal}
      size="small"
      htmlId="modal1"
      backdropClickExit
    >
      <ModalHeader headerLabel="Edit Event" showCloseButton />
      <ModalBody>
        <div className="container">
          <label>Title</label>
          <div className="flex-container">
            <Input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="container">
          <label>Start Date</label>
          <div className="flex-container">
            <Datetime
              dateFormat="DD/MM/YYYY"
              className="start-date"
              selected={start}
              value={start}
              onChange={(start) => setStart(new Date(start))}
            />
          </div>
        </div>
        <div className="container">
          <label>End Date</label>
          <div className="flex-container">
            <Datetime
              dateFormat="DD/MM/YYYY"
              className="end-date"
              placeholderText="End Date"
              selected={end}
              value={end}
              onChange={(end) => setEnd(new Date(end))}
            />
          </div>
        </div>
        <div className="container">
          <label className="desc">Description</label>
          <div className="flex-container ">
            <div className="medium-10 des">
              <textarea
                selected={description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              selected={type}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <SelectOption value="scheduler1" label="scheduler1" />
              <SelectOption value="scheduler2" label="scheduler2" />
              <SelectOption value="scheduler3" label="scheduler3" />
            </Select>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          children="Delete"
          color="red"
          onClick={() => {
            const event = ref(database, "Events/" + props.selectedObj.id);
            remove(event)
              .then(() => {
                props.setEditModalStatus(false);
              })
              .catch((error) => {
                props.setEditModalStatus(false);
              });
          }}
        />
        <Button
          children="Edit"
          type="submit"
          color="blue"
          onClick={() => {
            const event = ref(database, "Events/" + props.selectedObj.id);
            update(event, {
              title: title,
              start: start,
              end: end,
              description: description,
            })
              .then(() => {
                props.setEditModalStatus(false);
              })
              .catch((error) => {
                props.setEditModalStatus(false);
              });
          }}
        />
        <Button
          children="Close"
          onClick={() => props.setEditModalStatus(false)}
          color="default"
          id="small-1"
        />
      </ModalFooter>
    </Modal>
  );
}
