import React, { useState, useEffect, SyntheticEvent } from "react";
import { AxiosError } from "axios";
import { Container } from "semantic-ui-react";

import { IActivity } from "../Models/Activity";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import ActivityDashboard from "../pages/ActivityDashboard";
import agent from "../api/agent";

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.create(activity);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleEditActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.update(activity);
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleDeleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setTarget(event.currentTarget.name);
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSubmitting(false);
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await agent.Activities.list();
      const activities = response.map(a => {
        return {
          ...a,
          date: a.date.split(".")[0]
        };
      });
      setActivities(activities);
      setIsLoading(false);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7rem" }}>
        {isLoading ? (
          <Spinner content="Chill..." />
        ) : (
          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
            target={target}
          />
        )}
      </Container>
    </>
  );
};

export default App;
