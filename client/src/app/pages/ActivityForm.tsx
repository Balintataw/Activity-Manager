import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { useParams, useHistory } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { IActivityFormValues, ActivityFormValues } from "../Models/Activity";
import ActivityStore from "../stores/activityStore";
import { category } from "../common/options/categoryOptions";
import TextInput from "../common/form/TextInput";
import TextAreaInput from "../common/form/TextAreaInput";
import SelectInput from "../common/form/SelectInput";
import DateInput from "../common/form/DateInput";
import { combineDateTime } from "../common/util/util";

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

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      loadActivity(params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, params.id]);

  const handleFinalFormSubmit = async (values: any) => {
    const dateAndTime = combineDateTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      await createActivity(newActivity);
    } else {
      await editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={activity.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  options={category}
                  placeholder="Category"
                  value={activity.category}
                  component={SelectInput}
                />
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={activity.date}
                    component={DateInput}
                    date
                  />
                  <Field
                    name="time"
                    placeholder="Time"
                    value={activity.time}
                    component={DateInput}
                    time
                  />
                </Form.Group>
                <Field
                  name="city"
                  placeholder="City"
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name="venue"
                  placeholder="Venue"
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  loading={!target && submitting}
                  disabled={loading}
                />
                <Button
                  floated="right"
                  type="button"
                  content="Cancel"
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
