import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { IActivity } from "../Models/Activity";
import ActivityStore from "../stores/activityStore";

export const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    loadActivity,
    editActivity,
    submitting,
    target,
    activity: initialActivity,
    clearActivity
  } = activityStore;

  const history = useHistory();
  const params = useParams<{ id: string }>();

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
  });

  useEffect(() => {
    if (params.id && !activity.id) {
      loadActivity(params.id).then(
        () => initialActivity && setActivity(initialActivity)
      );
    }
    return () => clearActivity();
  }, [activity.id, loadActivity, clearActivity, params.id, initialActivity]);

  const handleInputChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const submit = async () => {
    console.log("SUB", activity);
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      await createActivity(newActivity);
      history.push(`/activities/${newActivity.id}`);
    } else {
      await editActivity(activity);
      history.push(`/activities/${activity.id}`);
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={submit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name="description"
          rows={2}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name="date"
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          positive
          type="submit"
          content="Submit"
          loading={!target && submitting}
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => history.push("/activities")}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
