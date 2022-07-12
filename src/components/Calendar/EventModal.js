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
import {
  addEvent,
  deleteEvent,
  schedulerOption,
  updateEvent,
} from "../../Utils/utils";

function EventModal(props) {
  const {
    showCreateModal,
    setCreateModalStatus,
    showEditModal,
    setEditModalStatus,
    selectedObj,
    showAlertMessage,
  } = props;

  const initialValues = {
    title: showCreateModal ? "" : selectedObj.title,
    schedulertype: showCreateModal ? "" : selectedObj.schedulertype,
    description: showCreateModal ? "" : selectedObj.description,
    start: showCreateModal ? "" : selectedObj.start,
    end: showCreateModal ? "" : selectedObj.end,
    color: showCreateModal ? "" : selectedObj.color,
  };

  const [event, setEvent] = useState(initialValues);
  const [inProgress, setInProgress] = useState(false);

  const validateInputs = (event) => {
    const errorEl = document.querySelector(".error");
    if (
      event.title === "" ||
      event.schedulertype === "" ||
      event.start === "" ||
      event.end === ""
    ) {
      errorEl.textContent = "Please fill all the fields";
      return false;
    }

    if (event.start >= event.end) {
      errorEl.textContent = "End date should be greater than start ";
      return false;
    }
    return true;
  };

  const handleCreate = (newEvent) => {
    if (validateInputs(newEvent)) {
      setInProgress(true);
      addEvent(newEvent)
        .then(() => {
          setCreateModalStatus(false);
          setInProgress(false);
          showAlertMessage("success", "Event created successfully");

        })
        .catch((error) => {
          setInProgress(false);
          console.error(error.message);

          showAlertMessage("error", "Failed to create the event");
        });
    }
  };

  const handleEdit = () => {
    if (validateInputs(event)) {
      setInProgress(true);
      updateEvent(event, selectedObj.id)
        .then(() => {
          setInProgress(false);
          setEditModalStatus(false);
          showAlertMessage("success", "Event updated successfully");
        })
        .catch((error) => {
          console.error(error.message);
          setInProgress(false);
          setEditModalStatus(false);
          showAlertMessage("error", "Failed to update the event");
        });
    }
  };

  const handleDelete = () => {
    setInProgress(true);
    deleteEvent(selectedObj.id)
      .then(() => {
        setInProgress(false);
        setEditModalStatus(false);
        showAlertMessage("success", "Successfully deleted the event");

      })
      .catch((error) => {
        console.error(error.message);
        setInProgress(false);
        setEditModalStatus(false);
        showAlertMessage("error", "Failed to delete the event");

      });
  };

  return (
    <div className="modal">
      <Modal
        applicationId="event-scheduler"
        onHide={() => {
          setCreateModalStatus(false);
          setEditModalStatus(false);
        }}
        show={showCreateModal || showEditModal}
        size="medium"
        htmlId="modal"
        backdropClickExit
        className="modal"
      >
        <ModalHeader headerLabel="Create Event" showCloseButton={false} />
        <ModalBody>
          <div className="container">
            <div className="options">
              <label className="required-field">Title</label>
              <Input
                className="input"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
            </div>
            <div className="options">
              <label className="required-field">Type</label>
              <Select
                defaultValue={`${
                  showCreateModal
                    ? "Select Scheduler"
                    : schedulerOption[event.schedulertype].name
                }`}
                className="input"
                selected={event.schedulertype}
                value={event.selected}
              >
                {Object.keys(schedulerOption).map((option) => (
                  <SelectOption
                    id={option}
                    key={option}
                    value={schedulerOption[option].name}
                    label={schedulerOption[option].name}
                    onClick={() =>
                      setEvent({
                        ...event,
                        schedulertype: option,
                      })
                    }
                  />
                ))}
              </Select>
            </div>
            <div className="options">
              <label className="required-field">Start Date</label>
              <Datetime
                dateFormat="DD/MM/YYYY"
                className="input"
                selected={event.start}
                value={new Date(event.start)}
                onChange={(start) =>
                  setEvent({
                    ...event,
                    start: start,
                  })
                }
              />
            </div>
            <div className="options">
              <label className="required-field">End Date</label>
              <Datetime
                dateFormat="DD/MM/YYYY"
                className="input"
                selected={event.end}
                value={new Date(event.end)}
                onChange={(end) =>
                  setEvent({
                    ...event,
                    end: end,
                  })
                }
              />
            </div>
            <div className="options">
              <label>Description</label>
              <textarea
                className="input"
                selected={event.description}
                value={event.description}
                onChange={(e) =>
                  setEvent({ ...event, description: e.target.value })
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <p className="error"></p>
          <Button
            children="Close"
            onClick={() => {
              setCreateModalStatus(false);
              setEditModalStatus(false);
            }}
            color="default"
          />
          {showCreateModal && (
            <Button
              children="Create"
              type="submit"
              color="blue"
              onClick={() => handleCreate(event)}
              disabled={inProgress}
              loading={inProgress}
            />
          )}
          {showEditModal && (
            <>
              <Button
                children="Edit"
                type="submit"
                color="blue"
                onClick={() => {
                  handleEdit();
                }}
                disabled={inProgress}
                loading={inProgress}
              />
              <Button
                children="Delete"
                color="red"
                onClick={() => {
                  handleDelete();
                }}
                disabled={inProgress}
                loading={inProgress}
              />
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EventModal;
