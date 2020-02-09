import React, { useEffect, useContext } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import ActivityStore from "../stores/activityStore";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import ActivityDashboard from "../pages/ActivityDashboard";

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "7rem" }}>
        {activityStore.loading ? (
          <Spinner content="Loading Activities..." />
        ) : (
          <ActivityDashboard />
        )}
      </Container>
    </>
  );
};

export default observer(App);
